import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { useTheme } from '../../../../core/theme/context/ThemeProvider';
import { useNetworkInfo } from '../../../../core/network/context/NetworkProvider';

jest.mock('../../../../core/network/state/networkState', () => ({
  subscribeToNetwork: jest.fn(),
  forceNetworkStatus: jest.fn(),
}));

jest.mock('../../../../core/network/context/NetworkProvider', () => ({
  useNetworkInfo: jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: () => { return; },
  };
});

jest.mock('../../../../core/theme/context/ThemeProvider', () => ({
  useTheme: jest.fn(() => ({ theme: 'light' })),
}));

jest.mock('../../../../shared/components/action-button/ActionButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    ActionButton: ({ onPress, testID, label }: any) =>
      React.createElement(
        Pressable, 
        { onPress, testID }, 
        React.createElement(Text, null, label || 'Button')
      )
  };
});

jest.mock('../../components/globe/Globe', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    Globe: ({ onDisplayed, onSelectCountry }: any) => (
      <>
        <Pressable testID="globe-container" onPress={() => onDisplayed?.()}>
          <Text>Globe</Text>
        </Pressable>

        <Pressable
          testID="globe-select-country"
          onPress={() => onSelectCountry('UK')}
        >
          <Text>Select Country</Text>
        </Pressable>
      </>
    ),
  };
});

jest.mock('../../../restaurants/screens/RestaurantListScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'Restaurant List');
});

const mockUseNetworkInfo = (online = true, wasOffline = false) =>
  (useNetworkInfo as jest.Mock).mockReturnValue({
    isDeviceOnline: online,
    wasDeviceOffline: wasOffline,
  });

const createScreenProps = () => ({
  navigation: { navigate: jest.fn(), setOptions: jest.fn() } as any,
  route: { key: 'Home', name: 'Home' as const, params: undefined },
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetworkInfo();
  });

  describe('Settings and navigation', () => { 
    it('sets header settings button correctly and navigates to Settings', () => {
      const props = createScreenProps();

      render(<HomeScreen {...props} />);
      expect(props.navigation.setOptions).toHaveBeenCalled();

      const headerRight = props.navigation.setOptions.mock.calls[0][0].headerRight;
      const headerElement = headerRight();

      act(() => { headerElement.props.onPress(); });

      expect(props.navigation.navigate).toHaveBeenCalledWith('Settings');
    });

    it('renders list button in top-right', () => {
      const props = createScreenProps();
      const { getByTestId } = render(<HomeScreen {...props} />);

      expect(getByTestId('go-to-list')).toBeTruthy();
    });

    it('navigates to RestaurantList when country selected on globe', () => {
      const props = createScreenProps();
      const { getByTestId } = render(<HomeScreen {...props} />);

      fireEvent.press(getByTestId('globe-select-country')); 

      expect(props.navigation.navigate).toHaveBeenCalledWith('RestaurantList', { selectedCountry: 'UK'});
    });
  });

  describe('Globe', () => {
    it('renders globe loader initially', () => {
      const props = createScreenProps();
      const { getByText } = render(<HomeScreen {...props} />);

      expect(getByText('Loading globe…')).toBeTruthy();
    });

    it('hides globe loader after onDisplayed + 1s delay', () => {
      jest.useFakeTimers();

      const props = createScreenProps();
      const { queryByText, getByTestId } = render(<HomeScreen {...props} />);

      fireEvent.press(getByTestId('globe-container'));
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(queryByText('Loading globe…')).toBeNull();

      jest.useRealTimers();
    });

    it('shows offline message when device is offline', () => {
      mockUseNetworkInfo(false, false);
      
      const props = createScreenProps();
      const { getByText } = render(<HomeScreen {...props} />);

      expect(getByText(/Globe is not available while offline. Please switch to List via View List button to see restaurants./i)).toBeTruthy();
    });

    it('navigates to RestaurantList when top-right list button pressed', () => {
      const props = createScreenProps();
      const { getByTestId } = render(<HomeScreen {...props} />);

      fireEvent.press(getByTestId('go-to-list'));

      expect(props.navigation.navigate).toHaveBeenCalledWith('RestaurantList', {});
    });

    it('clears globe loader timer on unmount', () => {
      jest.useFakeTimers();

      const props = createScreenProps();
      const { unmount, getByTestId } = render(<HomeScreen {...props} />);

      fireEvent.press(getByTestId('globe-container'));
      act(() => { unmount(); jest.advanceTimersByTime(1000); });

      jest.useRealTimers();
    });

    it('updates globe loader colors when theme changes', () => {
      const props = createScreenProps();
      (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });
      const { getByText } = render(<HomeScreen {...props} />);
      const loaderText = getByText(/Loading globe…/i);

      expect(loaderText.props.style[1].color).toBeDefined();
    });
  });

  describe('ConnectivityBanner', () => {
    it('renders offline banner when device is offline', () => {
      mockUseNetworkInfo(false, false);
  
      const props = createScreenProps();
      const { getByTestId, getByText } = render(<HomeScreen {...props} />);

      expect(getByTestId('connectivity-banner')).toBeTruthy();
      expect(getByText("You're offline. Globe view and some features are unavailable.")).toBeTruthy();
    });
    
    it('renders back online banner when device was offline and comes back online', () => {
      jest.useFakeTimers();

      mockUseNetworkInfo(true, true);

      const props = createScreenProps();
      const { getByTestId, getByText } = render(<HomeScreen {...props} />);

      expect(getByTestId('connectivity-banner')).toBeTruthy();
      expect(getByText("You're back online. Globe view is available.")).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(getByTestId('connectivity-banner').props.style).toEqual(
        expect.objectContaining({ opacity: 0 }) 
      );  

      jest.useRealTimers(); 
    });

    it('does not render banner when online and was never offline', () => {
      mockUseNetworkInfo(true, false);

      const props = createScreenProps();
      const { queryByTestId } = render(<HomeScreen {...props} />);
      
      expect(queryByTestId('connectivity-banner')).toBeNull();
    });
  });
});