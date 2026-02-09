import { StatusBar } from 'react-native';
import RootNavigator from './src/core/navigation/RootNavigator';
import { Providers } from './src/app/providers';
import { useTheme } from './src/core/theme/context/ThemeProvider';

export function InnerApp() {
  const { theme, isThemeLoaded } = useTheme();

  if (!isThemeLoaded) return null; 

  return (
    <>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <Providers>
      <InnerApp />
    </Providers>
  );
}