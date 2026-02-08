import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { useTheme } from "../../../core/theme/context/ThemeProvider";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getColors } from "../../../core/theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { ActionButton } from "../../../shared/components/action-button/ActionButton";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ConnectivityBanner } from "../../../shared/components/connectivity-banner/ConnectivityBanner";
import { Globe } from "../components/globe/Globe";
import { useNetworkInfo } from "../../../core/network/context/NetworkProvider";
import { moderateScale, scale, scaleFont, verticalScale } from "../../../shared/utils/scale";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme } = useTheme();
  const colors = useMemo(() => getColors(theme), [theme]);
  const { isDeviceOnline, wasDeviceOffline } = useNetworkInfo();
  const [globeLoading, setGlobeLoading] = useState(true);
  const [globeRenderToken, setGlobeRenderToken] = useState(0);
  const hideLoaderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isDeviceOnline) return; 

      setGlobeLoading(true);
      setGlobeRenderToken(prev => prev + 1);

      return () => {
        if (hideLoaderTimer.current) {
          clearTimeout(hideLoaderTimer.current);
        }
      };
    }, [isDeviceOnline])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ActionButton
          testID="header-settings"
          icon="settings-outline"
          label=""
          variant="ghost"
          iconSize={moderateScale(22)}
          onPress={() => navigation.navigate('Settings')}
          style={{
            paddingHorizontal: scale(12),
          }}
        />
      ),
    });
  }, [navigation, theme]);

  const handleGlobeDisplayed = () => {
    if (hideLoaderTimer.current) {
      clearTimeout(hideLoaderTimer.current);
    }

    hideLoaderTimer.current = setTimeout(() => {
      setGlobeLoading(false);
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ConnectivityBanner online={isDeviceOnline} wasOffline={wasDeviceOffline} colors={colors} />
      
      <ActionButton
        label="View list"
        icon="list-outline"
        iconSize={moderateScale(22)}
        testID="go-to-list"
        onPress={() => navigation.navigate('RestaurantList', {})}
        style={{
          position: 'absolute',
          top: scale(12),
          right: scale(12),
          zIndex: 15
        }}
      />

      <View style={styles.globeContainer}>
        {isDeviceOnline && globeLoading && (
          <View
            pointerEvents="none"
            style={[
              styles.globeLoader,
              { backgroundColor: colors.background },
            ]}
          >
            <ActivityIndicator size="large" color={colors.accent} />
            <Text
              style={[
                styles.loadingText,
                { color: colors.textPrimary },
              ]}
            >
              Loading globe…
            </Text>
          </View>
        )}

        {isDeviceOnline ? (
          <Globe
            renderToken={globeRenderToken} 
            onDisplayed={handleGlobeDisplayed}
            onSelectCountry={(countryId) => navigation.navigate('RestaurantList', { selectedCountry: countryId })}
          />
        ) : (
          <View 
            style={styles.offlineMessage}
            accessibilityRole="text"
            accessibilityLabel="Globe is not available while offline. Please switch to the List view to see restaurants."
          >
            <Text style={{ color: colors.textSecondary }}>
              Globe is not available while offline. Please switch to List via View List button to see restaurants.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  globeContainer: {
    flex: 1,
    position: 'relative',
  },
  globeLoader: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(12),
    fontSize: scaleFont(14),
  },
  offlineMessage: {
    padding: scale(16),
  },
  debugButton: {
    marginVertical: verticalScale(8),
    padding: scale(8),
    borderRadius: moderateScale(6),
  },
  debugText: {
    color: '#fff',
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  e2eSelectButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(24),
    height: scale(24),
    opacity: 0.01,
    zIndex: 20,
  },
});