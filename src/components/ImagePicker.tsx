import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, theme } from '../../constants/theme';

type ImagePickerProps = {
  value: string | null;
  onChange: (uri: string | null) => void;
};

export default function ImagePickerField({ value, onChange }: ImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const solicitarPermissao = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissao necessaria', 'Permita o acesso a galeria nas configuracoes.');
      return false;
    }
    return true;
  };

  const abrirGaleria = async () => {
    if (Platform.OS !== 'web' && !(await solicitarPermissao())) {
      return;
    }

    setLoading(true);

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    setLoading(false);

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const abrirCamera = async () => {
    const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ExpoImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const abrirOpcoes = () => {
    Alert.alert('Adicionar foto', '', [
      { text: 'Camera', onPress: () => void abrirCamera() },
      { text: 'Galeria', onPress: () => void abrirGaleria() },
      value
        ? { text: 'Remover foto', style: 'destructive', onPress: () => onChange(null) }
        : undefined,
      { text: 'Cancelar', style: 'cancel' },
    ].filter(Boolean) as any);
  };

  const handlePress = () => {
    if (Platform.OS === 'web') {
      void abrirGaleria();
      return;
    }

    abrirOpcoes();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {value ? (
        <Image source={{ uri: value }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={32} color={COLORS.textLight} />
          <Text style={styles.placeholderText}>
            {loading ? 'Abrindo...' : 'Adicionar foto'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 100,
    overflow: 'hidden',
    width: 100,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.textLight,
    fontSize: 11,
  },
});
