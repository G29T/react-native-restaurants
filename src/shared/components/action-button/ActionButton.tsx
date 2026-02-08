import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import { getColors, Colors } from '../../../core/theme/colors';
import { getButtonVariants, ButtonVariant } from '../../../core/theme/buttonVariants';
import { useTheme } from '../../../core/theme/context/ThemeProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale, scaleFont } from '../../utils/scale';
import HapticFeedback from 'react-native-haptic-feedback';

type ActionButtonProps = {
  label: string;
  icon?: string;
  iconSize?: number;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

export function ActionButton({
  label,
  icon,
  iconSize = 22,
  variant = 'secondary',
  onPress,
  disabled = false,
  style,
  testID,
}: ActionButtonProps) {
  const { theme } = useTheme();
  const colors: Colors = useMemo(() => getColors(theme), [theme]);

  const variants = useMemo(
    () =>
      getButtonVariants({
        accent: colors.accent,
        onAccent: colors.onAccent,
        surface: colors.surface,
        textPrimary: colors.textPrimary,
        border: colors.border,
      }),
    [colors]
  );

  const v = variants[variant];

  const scaledIconSize = moderateScale(iconSize);

  const paddingVertical = Math.max(scale(6), scaledIconSize * 0.4);
  const paddingHorizontal = Math.max(scale(10), scaledIconSize * 0.7);
  const fontSize = Math.max(scaleFont(12), scaledIconSize * 0.7);
  const borderRadius = scaledIconSize + scale(6);

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      hitSlop={8} 
      onPress={() => {
        HapticFeedback.trigger('impactLight');
        onPress();
      }}
      style={({ pressed }) => [
        styles.container,
        {
          paddingVertical,
          paddingHorizontal,
          borderRadius,
          backgroundColor: pressed
            ? `${v.background}22`
            : v.background,
          borderColor: v.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={scaledIconSize}
          color={v.text}
          style={styles.icon}
        />
      )}

      <Text 
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.label, { color: v.text, fontSize }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: scale(44),
    maxWidth: '100%',
  },
  icon: {
    marginRight: scale(8),
  },
  label: {
    fontWeight: '600',
    flexShrink: 1,
  },
});