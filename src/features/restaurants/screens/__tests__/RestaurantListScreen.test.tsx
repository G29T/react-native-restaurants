import React, { act } from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useRestaurants } from '../../hooks/useRestaurants';
import RestaurantListScreen from '../RestaurantListScreen';
import { Restaurant } from '../../types';
import { useNetworkInfo } from '../../../../core/network/context/NetworkProvider';

jest.mock('../../../../core/network/context/NetworkProvider', () => ({
  useNetworkInfo: jest.fn(),
}));

jest.mock('../../../../core/theme/context/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

jest.mock('../../../../core/theme/colors', () => ({
  getColors: () => ({
    background: 'mock-background',
    surface: 'mock-surface',
    textPrimary: 'mock-text-primary',
    textSecondary: 'mock-text-secondary',
    border: 'mock-border',
    accent: 'mock-accent',
    onAccent: 'mock-on-accent',
    subtle: 'mock-subtle',
  }),
}));

jest.mock('../../components/FilterButton', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    FilterButton: ({ label, value, onPress }: any) =>
      React.createElement(
        Text,
        { testID: `filter-${label.toLowerCase()}`, onPress },
        `${label}:${value}`
      ),
  };
});

jest.mock('../../components/FilterModal', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    FilterModal: ({ visible }: any) =>
      visible
        ? React.createElement(Text, { testID: 'filter-modal' })
        : null,
  };
});

jest.mock('../../components/RestaurantCard', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    RestaurantCard: ({ restaurant }: any) =>
      React.createElement(
        Text,
        { testID: `restaurant-${restaurant.name}` },
        restaurant.name
      ),
  };
});

type UseRestaurantsReturn = {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
  offline: boolean;
};

jest.mock('../../hooks/useRestaurants', () => ({
  useRestaurants: jest.fn(),
}));

const renderScreen = (props = {}) => render(<RestaurantListScreen route={{ params: {} }} {...props} />);

const mockRestaurants: Restaurant[] = [
  { 
    name: 'Sea Food Restaurant', 
    geo: { address: { streetAddress: 'Main Street', addressLocality: 'London' } }, 
    url: 'https://sea-food-restaurant-test.com' 
  } as any,
  { 
    name: 'Italian Restaurant', 
    geo: { address: { streetAddress: 'Second Street', addressLocality: 'London' } }, 
    url: 'https://italian-restaurant-test.com' 
  } as any,
];

const mockUseNetworkInfo = (online = true, wasOffline = false) =>
  (useNetworkInfo as jest.Mock).mockReturnValue({
    isDeviceOnline: online,
    wasDeviceOffline: wasOffline,
  });

const mockUseRestaurants = (
  restaurants = mockRestaurants,
  loading = false,
  error: Error | null = null,
  offline = false
) =>
  (useRestaurants as jest.Mock<UseRestaurantsReturn>).mockReturnValue({ restaurants, loading, error, offline });


describe('RestaurantListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetworkInfo();
    mockUseRestaurants();
  });

  describe('Restaurant data', () => {
    it('displays a loading indicator while restaurant data is loading', () => {
      mockUseRestaurants([], true);

      renderScreen();
      expect(screen.getByText('Loading restaurants…')).toBeTruthy();
    });

    it('renders restaurant cards when data is available for the selected country', () => {
      renderScreen({ route: { params: { selectedCountry: 'UK' } } });

      expect(screen.getByTestId('restaurant-list')).toBeTruthy();
      expect(screen.getByTestId('restaurant-Sea Food Restaurant')).toBeTruthy();
      expect(screen.getByTestId('restaurant-Italian Restaurant')).toBeTruthy();
    });

    it('shows an empty-state message when no restaurants are available', () => {
      mockUseRestaurants([], false);

      renderScreen();

      expect(screen.getAllByText('No restaurants available yet').length).toBeGreaterThan(0);
    });

    it('shows an error message for UK when restaurant loading fails', () => {
      mockUseRestaurants([], false, new Error('Failed'));

      renderScreen({ route: { params: { selectedCountry: 'UK' } } });   

      expect(screen.getByText('Failed to load restaurants')).toBeTruthy();
    });
  });

  describe('Filters', () => {
    it('renders continent and country filter buttons', () => {
      renderScreen();

      expect(screen.getByTestId('filter-continent')).toBeTruthy();
      expect(screen.getByTestId('filter-country')).toBeTruthy();
    });

    it('opens the continent filter modal when the continent filter is pressed', () => {
      renderScreen();

      expect(screen.queryByTestId('filter-modal')).toBeNull();

      fireEvent.press(screen.getByTestId('filter-continent'));

      expect(screen.queryByTestId('filter-modal')).toBeTruthy();
    });

    it('opens the country filter modal when the country filter is pressed', () => {
      renderScreen();

      fireEvent.press(screen.getByTestId('filter-country'));

      expect(screen.queryByTestId('filter-modal')).toBeTruthy();
    });
  });

  describe('ConnectivityBanner', () => {
    it('renders offline banner when device is offline', () => {
      mockUseNetworkInfo(false, false);

      renderScreen();   

      expect(screen.getByTestId('connectivity-banner')).toBeTruthy();
      expect(screen.getByText("You're offline. Globe view is unavailable.")).toBeTruthy();
    });

    it('renders back online banner when device was offline and comes back online', () => {
      jest.useFakeTimers(); 

      mockUseNetworkInfo(true, true);

      renderScreen();

      expect(screen.getByTestId('connectivity-banner')).toBeTruthy();
      expect(screen.getByText("You're back online. Globe view is available.")).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(screen.getByTestId('connectivity-banner').props.style).toEqual(
        expect.objectContaining({ opacity: 0 }) 
      );

      jest.useRealTimers(); 
    });

    it('does not render banner when online and was never offline', () => {
      mockUseNetworkInfo(true, false);

      renderScreen();

      expect(screen.queryByTestId('connectivity-banner')).toBeNull();
    });
  });
});