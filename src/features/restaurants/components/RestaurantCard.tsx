import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Restaurant } from "../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale, verticalScale, moderateScale, scaleFont } from '../../../shared/utils/scale';

type RestaurantCardProps = {
  testID: string;
  restaurant: Restaurant;
  colors: any;
  theme: 'light' | 'dark';
};

export function RestaurantCard({ testID, restaurant, colors, theme }: RestaurantCardProps) {
  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Restaurant: ${restaurant.name}. Tap to view details.`}  
      onPress={() => Linking.openURL(restaurant.url)}
      android_ripple={{ color: colors.accent + '22' }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOpacity: theme === 'dark' ? 0.25 : 0.08,
          shadowRadius: moderateScale(10),
          shadowOffset: { width: 0, height: moderateScale(6) },
          elevation: 4,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        testID={`${testID}-accent`}
        style={[
          styles.cardAccent,
          {
            backgroundColor:
              theme === 'dark'
                ? 'rgba(59,130,246,0.75)'
                : colors.accent,
          },
        ]}
      />
      <Text
        testID={`${testID}-name`}
        style={[styles.name, { color: colors.textPrimary, fontSize: scaleFont(16) }]}
      >
        {restaurant.name}
      </Text>
      <Text
        testID={`${testID}-street`}
        style={[styles.address, { color: colors.textSecondary, fontSize: scaleFont(14) }]}
      >
        {restaurant.geo.address.streetAddress}
      </Text>
      <Text
        testID={`${testID}-city`}
        style={[styles.city, { color: colors.textSecondary, fontSize: scaleFont(14) }]}
      >
        {restaurant.geo.address.addressLocality}
      </Text>
      <Text
        testID={`${testID}-postal-code`}
        style={[styles.postalCode, { color: colors.textSecondary, fontSize: scaleFont(14) }]}
      >
        {restaurant.geo.address.postalCode}
      </Text>

      <View
        testID={`${testID}-arrow-link`}
        style={{
          marginTop: verticalScale(8),
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end'
        }}
      >
        <Text
          style={{
            fontSize: scaleFont(14),  
            fontWeight: '600',
            color: colors.accent,
            marginRight: scale(4),    
          }}
        >
          View restaurant
        </Text>
        <Ionicons
          testID={`${testID}-arrow-link-icon`}
          name="arrow-forward"
          size={moderateScale(14)}     
          color={colors.accent}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    padding: moderateScale(18),
    borderRadius: moderateScale(18),
    position: 'relative',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: moderateScale(14),
    bottom: moderateScale(14),
    width: moderateScale(4),
    borderRadius: moderateScale(2),
  },
  // Restaurant name
  name: {
    fontSize: scaleFont(16),
    fontWeight: '700',
  },
  // Restaurant address
  address: {
    marginTop: verticalScale(6),
    fontSize: scaleFont(15),
    lineHeight: verticalScale(22),
  },
  // Restaurant city
  city: {
    fontSize: scaleFont(15),
    lineHeight: verticalScale(22),
  },
  // Restaurant postal code
  postalCode: {
    fontSize: scaleFont(15),
    lineHeight: verticalScale(22),
  },
});