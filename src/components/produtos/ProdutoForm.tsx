import { useEffect, useState } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import ImagePickerField from '@/src/components/ImagePicker';
import { ErrorView } from '@/src/components/ErrorView';
import { LoadingView } from '@/src/components/LoadingView';
import { useCategorias } from '@/src/hooks/useCategorias';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';

type ProdutoFormProps = {
  control: Control<ProdutoFormData>;
  errors: FieldErrors<ProdutoFormData>;
  isSubmitting: boolean;
  onSubmit: () => void;
  submitLabel: string;
  onDelete?: () => void;
};

const unidades: ProdutoFormData['unidade'][] = ['un', 'kg', 'cx', 'L', 'm'];

function formatNumberInput(value: number) {
  return value === 0 ? '' : String(value);
}

function formatPriceInput(value: number) {
  if (value === 0) {
    return '';
  }

  return String(value).replace('.', ',');
}

type PriceFieldProps = {
  error?: string;
  onBlur: () => void;
  onChange: (value: number) => void;
  value: number;
};

function PriceField({ error, onBlur, onChange, value }: PriceFieldProps) {
  const [inputValue, setInputValue] = useState(formatPriceInput(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatPriceInput(value));
    }
  }, [isFocused, value]);

  return (
    <FormField error={error} label="Preco">
      <TextInput
        keyboardType="decimal-pad"
        onBlur={() => {
          setIsFocused(false);
          onBlur();

          if (inputValue === '') {
            setInputValue('');
            onChange(0);
            return;
          }

          const normalizado = inputValue.endsWith(',')
            ? inputValue.slice(0, -1)
            : inputValue;
          const numero = normalizado === '' ? 0 : Number(normalizado.replace(',', '.'));

          setInputValue(formatPriceInput(numero));
          onChange(numero);
        }}
        onChangeText={(text) => {
          const normalizado = text.replace(/[^0-9,]/g, '');
          const partes = normalizado.split(',');
          const valorFormatado =
            partes.length > 2 ? `${partes[0]},${partes.slice(1).join('')}` : normalizado;

          setInputValue(valorFormatado);

          if (valorFormatado === '' || valorFormatado.endsWith(',')) {
            onChange(valorFormatado === '' ? 0 : Number(valorFormatado.slice(0, -1) || '0'));
            return;
          }

          onChange(Number(valorFormatado.replace(',', '.')));
        }}
        onFocus={() => setIsFocused(true)}
        placeholder="0,00"
        placeholderTextColor={theme.colors.textLight}
        style={styles.input}
        value={inputValue}
      />
    </FormField>
  );
}

export default function ProdutoForm({
  control,
  errors,
  isSubmitting,
  onSubmit,
  submitLabel,
  onDelete,
}: ProdutoFormProps) {
  const { categorias, isLoading: isLoadingCategorias, error, carregarCategorias } = useCategorias();

  if (isLoadingCategorias) {
    return <LoadingView mensagem="Carregando categorias..." />;
  }

  if (error) {
    return <ErrorView mensagem={error} onRetry={carregarCategorias} />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="fotoUri"
          render={({ field: { onChange, value } }) => (
            <FormField label="Foto do produto">
              <ImagePickerField onChange={onChange} value={value ?? null} />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="nome"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormField error={errors.nome?.message} label="Nome do produto">
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Ex.: Cafe Especial 250g"
                placeholderTextColor={theme.colors.textLight}
                style={styles.input}
                value={value}
              />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="categoriaId"
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.categoriaId?.message} label="Categoria">
              <View style={styles.chipGroup}>
                {categorias.map((categoria) => {
                  const isSelected = value === categoria.id;

                  return (
                    <Pressable
                      key={categoria.id}
                      onPress={() => onChange(categoria.id)}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                        !isSelected && { backgroundColor: categoria.cor },
                      ]}>
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {categoria.nome}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="quantidade"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormField error={errors.quantidade?.message} label="Quantidade em estoque">
              <TextInput
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                placeholder="0"
                placeholderTextColor={theme.colors.textLight}
                style={styles.input}
                value={formatNumberInput(value)}
              />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="quantidadeMinima"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormField
              error={errors.quantidadeMinima?.message}
              hint="Abaixo deste valor o produto entra em estoque critico."
              label="Quantidade minima">
              <TextInput
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(text === '' ? 0 : Number(text))}
                placeholder="0"
                placeholderTextColor={theme.colors.textLight}
                style={styles.input}
                value={formatNumberInput(value)}
              />
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="preco"
          render={({ field: { onBlur, onChange, value } }) => (
            <PriceField
              error={errors.preco?.message}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="unidade"
          render={({ field: { onChange, value } }) => (
            <FormField error={errors.unidade?.message} label="Unidade">
              <View style={styles.chipGroup}>
                {unidades.map((unidade) => {
                  const isSelected = value === unidade;

                  return (
                    <Pressable
                      key={unidade}
                      onPress={() => onChange(unidade)}
                      style={[styles.unitChip, isSelected && styles.chipSelected]}>
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {unidade}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </FormField>
          )}
        />

        <Controller
          control={control}
          name="observacao"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormField error={errors.observacao?.message} label="Observacao">
              <TextInput
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Detalhes extras do produto"
                placeholderTextColor={theme.colors.textLight}
                style={[styles.input, styles.textArea]}
                textAlignVertical="top"
                value={value ?? ''}
              />
            </FormField>
          )}
        />

        <TouchableOpacity
          disabled={isSubmitting}
          onPress={onSubmit}
          style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}>
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? 'Salvando...' : submitLabel}
          </Text>
        </TouchableOpacity>

        {onDelete ? (
          <TouchableOpacity disabled={isSubmitting} onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Excluir produto</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
};

function FormField({ children, error, hint, label }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    gap: 18,
    padding: 24,
    paddingBottom: 40,
  },
  field: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    color: theme.colors.textLight,
    fontSize: 12,
  },
  error: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 16,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 110,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  unitChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    marginTop: 8,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#FCE4EA',
    borderColor: theme.colors.error,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
  },
  deleteButtonText: {
    color: theme.colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
