import { Colors } from './colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type VariantColors = {
  background: string;
  text: string;
  border: string;
};

export const getButtonVariants = (
  colors: Pick<Colors, 'accent' | 'onAccent' | 'surface' | 'textPrimary' | 'border'>
): Record<ButtonVariant, VariantColors> => ({
  primary: {
    background: colors.accent,
    text: colors.onAccent,
    border: colors.accent,
  },
  secondary: {
    background: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
  },
  ghost: {
    background: 'transparent',
    text: colors.textPrimary,
    border: 'transparent',
  },
});