import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function solicitarPermissao(): Promise<boolean> {
  if (!Device.isDevice) {
    console.warn('Notificacoes nao funcionam no simulador');
    return false;
  }

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

  const paraNotificar = produtos.slice(0, 3);

  for (const produto of paraNotificar) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Estoque critico',
        body: `${produto.nome}: ${produto.quantidade}/${produto.quantidadeMinima} abaixo do minimo`,
        data: { produtoNome: produto.nome },
        badge: produtos.length,
      },
      trigger: null,
    });
  }

  if (produtos.length > 3) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mais alertas de estoque',
        body: `+${produtos.length - 3} produtos com estoque critico. Verifique o ProEstoque.`,
        badge: produtos.length,
      },
      trigger: null,
    });
  }
}

export async function agendarVerificacaoDiaria() {
  const temPermissao = await solicitarPermissao();
  if (!temPermissao) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'ProEstoque',
      body: 'Verifique o estoque de hoje. Toque para abrir.',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function limparBadge() {
  await Notifications.setBadgeCountAsync(0);
}
