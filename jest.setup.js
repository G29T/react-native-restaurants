import 'react-native-gesture-handler/jestSetup';

afterAll(() => {
  jest.restoreAllMocks();
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-screens', () => {
  const RealModule = jest.requireActual('react-native-screens');
  return {
    ...RealModule,
    enableScreens: jest.fn(),
  };
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    WebView: props => React.createElement(View, props),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(() => jest.fn()),
  useNetInfo: jest.fn(() => ({
    isConnected: true,
  })),
}));