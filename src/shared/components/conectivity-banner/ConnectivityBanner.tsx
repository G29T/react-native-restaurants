import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Animated, AccessibilityInfo } from 'react-native';
import { moderateScale, scale, scaleFont } from '../../utils/scale';

type Props = {
  online: boolean;
  wasOffline?: boolean;
  colors: any;
};

export const ConnectivityBanner = ({ online, wasOffline, colors }: Props) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-scale(8))).current;

  const show = useCallback(() => {
    setVisible(true);
    
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);
  
  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -scale(8),
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    });
  }, [opacity, translateY]);

  useEffect(() => {
    if (!online) {
      show();
      AccessibilityInfo.announceForAccessibility(
        "You're offline. Globe view and some features are unavailable."
      );

      return;
    }

    if (online && wasOffline) {
      show();
      AccessibilityInfo.announceForAccessibility("You're back online. Globe view is available.");

      const timer = setTimeout(hide, 3000);
      return () => clearTimeout(timer);
    }

    hide();
  }, [online, wasOffline,show, hide]);

  if (!visible) return null;

  if (!online) {
    return (
      <Animated.View
        testID="connectivity-banner"
        accessibilityRole="alert"
        style={[
          styles.banner,
          {
            backgroundColor: colors.bannerWarningBg,
            borderColor: colors.bannerWarningBorder,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.bannerWarningText }]}>
          You're offline. Globe view and some features are unavailable.
        </Text>
      </Animated.View>
    );
  }

  if (online && wasOffline) {
    return (
      <Animated.View
        testID="connectivity-banner"
        style={[
          styles.banner,
          {
            backgroundColor: colors.bannerInfoBg,
            borderColor: colors.bannerInfoBorder,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.bannerInfoText }]}>
          You're back online. Globe view is available.
        </Text>
      </Animated.View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    padding: scale(12),               
    margin: scale(12),                
    borderRadius: moderateScale(8),   
    borderWidth: StyleSheet.hairlineWidth, 
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: scaleFont(14),          
  },
});