import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

type NotificationsModule = any;

function isExpoGo() {
  return (
    Constants.executionEnvironment === 'storeClient' ||
    Constants.appOwnership === 'expo'
  );
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (isExpoGo()) {
    return null;
  }

  return import('expo-notifications');
}

async function prepararCanalAndroid(Notifications: NotificationsModule) {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'ProEstoque',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

function criarTriggerImediato(Notifications: NotificationsModule) {
  return {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 1,
    repeats: false,
    ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
  };
}

export async function configurarNotificationHandler() {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function solicitarPermissao(): Promise<boolean> {
  if (isExpoGo()) {
    console.warn('Notificacoes locais estao desativadas no Expo Go. Use uma development build.');
    return false;
  }

  if (!Device.isDevice) {
    console.warn('Notificacoes nao funcionam no simulador');
    return false;
  }

  const Notifications = await getNotifications();
  if (!Notifications) return false;

  await prepararCanalAndroid(Notifications);

  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  if (statusAtual === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export const solicitarPermissaoNotificacoes = solicitarPermissao;

export async function notificarEstoqueCritico(
  produtos: { nome: string; quantidade: number; quantidadeMinima: number }[]
) {
  if (produtos.length === 0) return;

  const temPermissao = await solicitarPermissao();
  if (!temPermissao) return;

  const Notifications = await getNotifications();
  if (!Notifications) return;
  await prepararCanalAndroid(Notifications);

  const paraNotificar = produtos.slice(0, 3);

  for (const produto of paraNotificar) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Estoque critico',
          body: `${produto.nome}: ${produto.quantidade}/${produto.quantidadeMinima} abaixo do minimo`,
          data: { produtoNome: produto.nome },
          badge: produtos.length,
        },
        trigger: criarTriggerImediato(Notifications),
      });
    } catch (error) {
      console.warn('Falha ao agendar notificacao de estoque critico', error);
    }
  }

  if (produtos.length > 3) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Mais alertas de estoque',
          body: `+${produtos.length - 3} produtos com estoque critico. Verifique o ProEstoque.`,
          badge: produtos.length,
        },
        trigger: criarTriggerImediato(Notifications),
      });
    } catch (error) {
      console.warn('Falha ao agendar resumo de estoque critico', error);
    }
  }
}

export async function agendarVerificacaoDiaria() {
  const temPermissao = await solicitarPermissao();
  if (!temPermissao) return;

  const Notifications = await getNotifications();
  if (!Notifications) return;
  await prepararCanalAndroid(Notifications);

  await Notifications.cancelAllScheduledNotificationsAsync();

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ProEstoque',
        body: 'Verifique o estoque de hoje. Toque para abrir.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
        ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
      },
    });
  } catch (error) {
    console.warn('Falha ao agendar verificacao diaria', error);
  }
}

export async function limparBadge() {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.setBadgeCountAsync(0);
}
