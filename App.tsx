import { StatusBar, View } from 'react-native';
import RootNavigator from './src/core/navigation/RootNavigator';
import { Providers } from './src/app/providers';
import { useTheme } from './src/core/theme/context/ThemeProvider';
import { getColors } from './src/core/theme/colors';
import { useMemo } from 'react';

export function InnerApp() {
  const { theme, isThemeLoaded } = useTheme();

  if (!isThemeLoaded) return null; 

  const colors = useMemo(() => getColors(theme), [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  return (
    <Providers>
      <InnerApp />
    </Providers>
  );
}