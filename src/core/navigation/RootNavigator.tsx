import React, { useMemo } from 'react';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../theme/context/ThemeProvider';
import { getColors } from '../theme/colors';
import { NavigationContainer, DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../features/home/screens/HomeScreen';
import SettingsScreen from '../../features/settings/SettingsScreen';
import RestaurantListScreen from '../../features/restaurants/screens/RestaurantListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { theme } = useTheme();
  const colors = useMemo(() => getColors(theme), [theme]);

  const navTheme = useMemo<NavigationTheme>(
    () => ({
      dark: theme === 'dark',
      colors: {
        background: colors.background,
        primary: colors.accent,
        text: colors.textPrimary,
        border: colors.border,
        card: colors.surface,
        notification: colors.accent,
      },
      fonts: DefaultTheme.fonts,
    }),
    [theme, colors]
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface, 
          },
          headerTintColor: theme === 'dark' ? '#fff' : '#000', 
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RestaurantList" component={RestaurantListScreen} options={{ title: "Nando's Restaurants" }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}