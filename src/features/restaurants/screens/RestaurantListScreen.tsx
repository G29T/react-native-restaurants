import React, { useMemo, useState } from 'react';
import { SectionList, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../../core/theme/context/ThemeProvider';
import { getColors } from '../../../core/theme/colors';
import { CONTINENT_MAP, COUNTRIES } from '../../../shared/constants/continents-countries';
import { ConnectivityBanner } from '../../../shared/components/connectivity-banner/ConnectivityBanner';
import { RestaurantCard } from '../components/RestaurantCard';
import { Restaurant } from '../types';
import { useRestaurants } from '../hooks/useRestaurants';
import { FilterButton } from '../components/FilterButton';
import { FilterModal } from '../components/FilterModal';
import { useNetworkInfo } from '../../../core/network/context/NetworkProvider';
import { moderateScale, scale, scaleFont, verticalScale } from '../../../shared/utils/scale';

type RestaurantListProps = {
  route?: { params?: { selectedCountry?: string } };
};

type CountryGroup = {
  countryId: string;
  countryLabel: string;
  restaurants: Restaurant[];
};

type ContinentSection = {
  title: string;             
  data: CountryGroup[];      
};

export default function RestaurantListScreen({ route }: RestaurantListProps) {
  const { theme } = useTheme();
  const colors = useMemo(() => getColors(theme), [theme]);

  const { isDeviceOnline, wasDeviceOffline } = useNetworkInfo();

  const selectedCountry = route?.params?.selectedCountry ?? null;
  
  const [country, setCountry] = useState<string | null>(selectedCountry);
  const [continent, setContinent] = useState<string | null>(selectedCountry ? CONTINENT_MAP[selectedCountry] ?? null : null);
  const { restaurants, loading, error } = useRestaurants(selectedCountry || 'UK');
  const [continentModalOpen, setContinentModalOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const continents = useMemo(() => Array.from(new Set(Object.values(CONTINENT_MAP))), []);

  const countriesByContinent = useMemo(
    () =>
      COUNTRIES.filter(
        country => !continent || CONTINENT_MAP[country.id] === continent
      ),
    [continent]
  );

  /*
    UK Restaurants are currently returned by the API in alphabetical order by restaurant name,
    so no additional sorting is needed.
     
    'useMemo' can be used for sorting if needed in the future, as long as the API response and schema remain unchanged.
    Note: this approach is suitable for small data sets

    If the API response schema changes or the data set gets bigger, the sorting logic will need to be updated accordingly.
  */  
  // const restaurants = useMemo(
  //   () => [...restaurants].sort((a, b) => a.name.localeCompare(b.name)),
  //   [restaurants]
  // );

  const continentSections: ContinentSection[] = useMemo(() => {
    return Object.values(
      COUNTRIES.reduce<Record<string, ContinentSection>>((acc, c) => {

        if (continent && CONTINENT_MAP[c.id] !== continent) {
          return acc;
        }

        if (country && c.id !== country) {
          return acc;
        }

        const continentName = CONTINENT_MAP[c.id] ?? 'Other';

        // Initialise continent section if needed
        acc[continentName] ??= { title: continentName, data: [] };

        // Add country group
        acc[continentName].data.push({
          countryId: c.id,
          countryLabel: c.label,
          // Data currently available only for UK
          restaurants: c.id === 'UK' && (!country || country === 'UK') ? restaurants : [],
        });

        return acc;
      }, {})
    );
  }, [continent, country, restaurants]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ConnectivityBanner online={isDeviceOnline} wasOffline={wasDeviceOffline} colors={colors} />
      <View style={styles.filterButtonsRow}>
        <FilterButton
          label="Continent"
          value={continent ?? 'All'}
          onPress={() => setContinentModalOpen(true)}
        />

        <FilterButton
          label="Country"
          value={
            country
              ? COUNTRIES.find(c => c.id === country)?.label ?? country
              : 'All'
          }
          onPress={() => setCountryModalOpen(true)}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading restaurants…
          </Text>
        </View>
      ) : (
        <SectionList
          testID="restaurant-list"
          sections={continentSections}
          keyExtractor={group => group.countryId}
          stickySectionHeadersEnabled={false}

          renderSectionHeader={({ section }) => (
            <View style={[ styles.continentHeader, { borderBottomColor: colors.border } ]}>
              <Text style={[ styles.continentLabel, { color: colors.subtle } ]}>
                {section.title}
              </Text>
            </View>
          )}

          renderItem={({ item: countryGroup }) => (
            <View style={styles.countryGroup} accessible={true}>
              <Text testID={`country-${countryGroup.countryId.toLowerCase()}`}
                style={[ styles.countryTitle, { color: colors.textPrimary } ]}
              >
                {countryGroup.countryLabel}
              </Text>

              {countryGroup.restaurants.length === 0 ? (
                <Text style={[ styles.noDataText, { color: colors.textSecondary } ]}>
                  {countryGroup.countryId === 'UK' && error
                    ? 'Failed to load restaurants'
                    : 'No restaurants available yet'}
                </Text>
              ) : (
                countryGroup.restaurants.map((restaurant, index) => (
                  <RestaurantCard
                    testID={`restaurant-card-${index}`}
                    /*
                      key={`${restaurant.name}-${index}`} is acceptable because the data is fetched 
                      from an external source and the user cannot delete, insert, or reorder items in the list
                      
                      Neither URL nor name is guaranteed to be unique; 
                      maybe duplicates exist due to potential errors.
                    */
                    key={`${restaurant.name}-${index}`}
                    restaurant={restaurant}
                    colors={colors}
                    theme={theme}
                  />
                ))
              )}
            </View>
          )}
        />
      )}
      <FilterModal
        visible={continentModalOpen}
        title="Select continent"
        options={continents}
        onSelect={value => {
          setContinent(value);
          setCountry(null); 
          setContinentModalOpen(false);
        }}
        onClose={() => setContinentModalOpen(false)}
        colors={colors}
      />
      <FilterModal
        visible={countryModalOpen}
        title="Select country"
        options={countriesByContinent.map(c => c.id)}
        mapIdToLabel={id =>
          COUNTRIES.find(c => c.id === id)?.label ?? id
        }
        onSelect={value => {
          setCountry(value);
          
          const selectedContinent = value
            ? CONTINENT_MAP[value]
            : null;

          setContinent(selectedContinent ?? null);
          setCountryModalOpen(false);
        }}
        onClose={() => setCountryModalOpen(false)}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterButtonsRow: {
    flexDirection: 'row',
    gap: scale(12),
    padding: scale(12),
  },
  filterButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  loadingText: {
    fontSize: scaleFont(14),
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
  continentHeader: {
    marginTop: verticalScale(28),
    marginBottom: verticalScale(8),
    marginHorizontal: scale(16),
    borderBottomWidth: 1.5,
    paddingBottom: verticalScale(4),
  },
  continentLabel: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  countryGroup: {
    marginBottom: verticalScale(24),
  },
  countryTitle: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(10),
    fontSize: scaleFont(17),
    fontWeight: '700',
  },
  noDataText: {
    marginHorizontal: scale(16),
    fontStyle: 'italic',
    fontSize: scaleFont(14),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});