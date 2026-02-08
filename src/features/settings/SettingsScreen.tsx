import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../../core/theme/context/ThemeProvider';
import { getColors } from '../../core/theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale, scale, scaleFont } from '../../shared/utils/scale';
import HapticFeedback from 'react-native-haptic-feedback';

export default function SettingsScreen() {
  const { selectedTheme, setSelectedTheme, theme } = useTheme();
  const colors = useMemo(() => getColors(theme), [theme]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {(['system', 'light', 'dark'] as const).map(mode => {
        const selected = selectedTheme === mode;

        return (
          <Pressable
            testID={`settings-${mode}`}
            key={mode}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Theme: ${mode}`}
            onPress={() => {
              HapticFeedback.trigger('impactLight');
              setSelectedTheme(mode);
            }}
            style={[
              styles.modeOption,
              {
                backgroundColor: selected
                  ? colors.accent
                  : colors.surface,
              },
            ]}
          >
            {selected && (
              <Icon
                testID="selected-icon"
                name="checkmark"
                size={moderateScale(22)}         
                color="#fff"
                style={styles.icon}
              />
            )}

            <Text
              style={[
                styles.label,
                {
                  fontWeight: selected ? '700' : '400',
                  color: selected ? '#fff' : colors.textPrimary,
                },
              ]}
            >
              {mode.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(24),                    
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),                    
    borderRadius: moderateScale(10),       
    marginBottom: scale(8),     
    minHeight: scale(44),           
  },
  icon: {
    marginRight: scale(8),                 
  },
  label: {
    fontSize: scaleFont(16),               
  },
});