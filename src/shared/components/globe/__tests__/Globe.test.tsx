import React from 'react';
import { render } from '@testing-library/react-native';
import * as colorsModule from '../../../../core/theme/colors';
import { useTheme } from '../../../../core/theme/context/ThemeProvider';
import { Globe } from '../Globe';
import { generateGlobeHtml } from '../globeHtml';

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    WebView: (props: any) => (
      <View testID="webview" {...props} />
    ),
  };
});

jest.mock('../../../../core/theme/context/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../../../core/theme/colors', () => ({
  getColors: jest.fn(),
}));

jest.mock('../globeHtml', () => ({
  generateGlobeHtml: jest.fn(),
}));

jest.mock('../../../constants/continents-countries', () => ({
  COUNTRIES: [
    { id: 'UK', label: 'United Kingdom', lat: 55.3781, lng: -3.436 },
  ],
}));

describe('WebView based interactive globe', () => {
  let onSelectCountryMock: jest.Mock;
  let onDisplayedMock: jest.Mock;

  const renderGlobe = () =>
    render(
      <Globe
        onSelectCountry={onSelectCountryMock}
        onDisplayed={onDisplayedMock}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    
    onSelectCountryMock = jest.fn();
    onDisplayedMock = jest.fn();

    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
    (colorsModule.getColors as jest.Mock).mockReturnValue({ background: 'mock-bg-light' });
    (generateGlobeHtml as jest.Mock).mockReturnValue('<html>Mock Globe</html>');
  });

  it('renders container and WebView with generated HTML', () => {
    const { getByTestId } = renderGlobe();

    expect(getByTestId('globe-container')).toBeTruthy();
    expect(getByTestId('webview').props.source.html).toBe(
      '<html>Mock Globe</html>'
    );
  });

  it('calls onDisplayed when WebView finishes loading', () => {
    const { getByTestId } = renderGlobe();

    getByTestId('webview').props.onLoadEnd();
    expect(onDisplayedMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSelectCountry when receiving a valid select message', () => {
    const { getByTestId } = renderGlobe();

    getByTestId('webview').props.onMessage({
      nativeEvent: {
        data: JSON.stringify({
          type: 'select',
          id: 'UK',
          hasData: true,
        }),
      },
    });

    expect(onSelectCountryMock).toHaveBeenCalledWith('UK', true);
  });

  it('ignores messages with unsupported types', () => {
    const { getByTestId } = renderGlobe();

    getByTestId('webview').props.onMessage({
      nativeEvent: {
        data: JSON.stringify({ type: 'unsupported' }),
      },
    });

    expect(onSelectCountryMock).not.toHaveBeenCalled();
  });

  it('handles malformed JSON safely without crashing', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { getByTestId } = renderGlobe();

    getByTestId('webview').props.onMessage({
      nativeEvent: { data: '{ invalid json' },
    });

    expect(onSelectCountryMock).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('regenerates HTML when theme changes', () => {
    const { rerender } = renderGlobe();

    expect(generateGlobeHtml).toHaveBeenLastCalledWith(
      'light',
      'mock-bg-light',
      expect.any(Array)
    );

    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });
    (colorsModule.getColors as jest.Mock).mockReturnValue({
      background: 'mock-bg-dark',
    });

    rerender(
      <Globe
        onSelectCountry={onSelectCountryMock}
        onDisplayed={onDisplayedMock}
      />
    );

    expect(generateGlobeHtml).toHaveBeenLastCalledWith(
      'dark',
      'mock-bg-dark',
      expect.any(Array)
    );
  });
});