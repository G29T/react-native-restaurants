import { render } from "@testing-library/react-native";
import * as ThemeHook from "../src/core/theme/context/ThemeProvider";
import { StatusBar } from "react-native";
import App, { InnerApp } from "../App";

jest.mock('../src/core/navigation/RootNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockRootNavigator() {
    return React.createElement(Text, { testID: 'root-navigator' }, 'RootNavigator');
  };
});

const setSelectedThemeMock = jest.fn();

const createMockTheme = (overrides?: Partial<ThemeHook.ThemeContextType>): ThemeHook.ThemeContextType => ({
  theme: 'light',          
  selectedTheme: 'light',  
  setSelectedTheme: setSelectedThemeMock,
  isThemeLoaded: true,     
  ...overrides,            
});

describe('InnerApp', () => {
  afterEach(() => {
    jest.restoreAllMocks(); 
    setSelectedThemeMock.mockClear(); 
  });

  it('renders null when theme is not loaded', () => {
    jest.spyOn(ThemeHook, 'useTheme').mockReturnValue(createMockTheme({ isThemeLoaded: false }));

    const { toJSON } = render(<InnerApp />);
    expect(toJSON()).toBeNull();
  });

  it('renders StatusBar and RootNavigator for light theme', () => {
    jest.spyOn(ThemeHook, 'useTheme').mockReturnValue(createMockTheme());

    const { getByTestId, UNSAFE_getByType } = render(<InnerApp />);

    const statusBar = UNSAFE_getByType(StatusBar);
    expect(statusBar.props.barStyle).toBe('dark-content');

    // RootNavigator
    expect(getByTestId('root-navigator')).toBeTruthy();
  });

  it('renders StatusBar with correct barStyle for dark theme', () => {
    jest.spyOn(ThemeHook, 'useTheme').mockReturnValue(
      createMockTheme({ theme: 'dark', selectedTheme: 'dark' })
    );

    const { UNSAFE_getByType } = render(<InnerApp />);
    const statusBar = UNSAFE_getByType(StatusBar);

    expect(statusBar.props.barStyle).toBe('light-content');
  });
});

describe('App', () => {
  it('renders InnerApp within Providers without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});