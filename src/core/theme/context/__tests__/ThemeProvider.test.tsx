import React from 'react';
import * as ReactNative from 'react-native';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../ThemeProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('ThemeProvider', () => {
  let useColorSchemeSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    useColorSchemeSpy = jest.spyOn(ReactNative, 'useColorScheme');
  });

  afterEach(() => {
    useColorSchemeSpy.mockRestore();
  });

  it('throws an error if useTheme is used outside ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider'
    );
  });

  it('defaults to system theme when no persisted value exists', async () => {
    useColorSchemeSpy.mockReturnValue('light');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isThemeLoaded).toBe(true);
    });

    expect(result.current.selectedTheme).toBe('system');
    expect(result.current.theme).toBe('light');
  });

  it('loads persisted theme from AsyncStorage', async () => {
    useColorSchemeSpy.mockReturnValue('light');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isThemeLoaded).toBe(true);
    });

    expect(result.current.selectedTheme).toBe('dark');
    expect(result.current.theme).toBe('dark');
  });

  it('ignores invalid persisted values', async () => {
    useColorSchemeSpy.mockReturnValue('dark');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isThemeLoaded).toBe(true);
    });

    expect(result.current.selectedTheme).toBe('system');
    expect(result.current.theme).toBe('dark');
  });

  it('resolves system theme when selectedTheme is system', async () => {
    useColorSchemeSpy.mockReturnValue('dark');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('system');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isThemeLoaded).toBe(true);
    });

    expect(result.current.theme).toBe('dark');
  });

  it('updates and persists selected theme', async () => {
    useColorSchemeSpy.mockReturnValue('light');

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => {
      expect(result.current.isThemeLoaded).toBe(true);
    });

    act(() => {
      result.current.setSelectedTheme('dark');
    });

    expect(result.current.selectedTheme).toBe('dark');
    expect(result.current.theme).toBe('dark');
    expect(setItemSpy).toHaveBeenCalledWith('themeMode', 'dark');
  });  
});