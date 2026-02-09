import React from 'react';
import { render } from '@testing-library/react-native';
import RootNavigator from '../RootNavigator';
import * as ThemeHook from '../../theme/context/ThemeProvider';

jest.mock('../../../features/home/HomeScreen', () => {
  const React = require('react'); 
  const { Text } = require('react-native'); 

  return function MockHomeScreen() {
    return React.createElement(Text, null, 'Home Screen');
  };
});

jest.mock('../../../features/settings/SettingsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockSettingsScreen() {
    return React.createElement(Text, null, 'Settings Screen');
  };
});

jest.mock('../../../features/restaurants/screens/RestaurantListScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockRestaurantListScreen() {
    return React.createElement(Text, null, 'Restaurant List Screen');
  };
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native'); 

  return {
    ...actualNav, 
    useNavigation: () => ({}),
  };
});

describe('Test that the RootNavigator renders screens', () => {
  const mockUseTheme = (theme: 'light' | 'dark' = 'light') =>
    jest.spyOn(ThemeHook, 'useTheme').mockReturnValue({
      selectedTheme: theme,
      theme,
      setSelectedTheme: jest.fn(),
      isThemeLoaded: true,
    });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Home screen light theme by default', () => {
    mockUseTheme('light');
    const { getByText } = render(<RootNavigator />);

    expect(getByText('Home Screen')).toBeTruthy();
  });

  it('renders Home screen correctly in dark theme', () => {
    mockUseTheme('dark');
    const { getByText } = render(<RootNavigator />);

    expect(getByText('Home Screen')).toBeTruthy();
  });

  it('does not crash when Home screen rendered', () => {
    mockUseTheme('light');

    expect(() => render(<RootNavigator />)).not.toThrow();
  });
});