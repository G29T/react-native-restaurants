import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { COUNTRIES } from '../../constants/continents-countries'; 
import { getColors } from '../../../core/theme/colors'; 
import { useTheme } from '../../../core/theme/context/ThemeProvider';
import { generateGlobeHtml } from './globeHtml';

type GlobeProps = {
  renderToken?: number;
  onSelectCountry: (countryId: string, hasData: boolean) => void;
  onDisplayed: () => void; 
};

export const Globe = ({ renderToken, onSelectCountry, onDisplayed }: GlobeProps) => {
  const { theme } = useTheme();
  const colors = useMemo(() => getColors(theme), [theme]);
  const backgroundColor = colors.background;

  const globeHtml = useMemo(() => generateGlobeHtml(theme, backgroundColor, COUNTRIES), [theme, backgroundColor, renderToken]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        
        if (data.type === 'select') {
          onSelectCountry(data.id, data.hasData);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Invalid WebView message', error.message);
        } else {
          console.error('Invalid WebView message', error);
        }
      } 
    },
    [onSelectCountry] 
  );

  return (
    <View 
      testID="globe-container"
      style={[styles.container, { backgroundColor }]} 
      accessibilityLabel="Interactive globe"
      accessibilityRole="image"
    >
      <WebView
        key={renderToken} 
        style={styles.webview}
        javaScriptEnabled
        scrollEnabled={false}
        onLoadEnd={onDisplayed}
        onMessage={handleMessage}
        source={{ html: globeHtml }}
        scalesPageToFit={Platform.OS === 'android'}
        androidLayerType="hardware"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  }, 
  webview: { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },
});