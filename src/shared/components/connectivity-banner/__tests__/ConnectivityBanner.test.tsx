import React from 'react';
import { render } from '@testing-library/react-native';
import { ConnectivityBanner } from '../ConnectivityBanner';
import { AccessibilityInfo } from 'react-native';

const colors = {
  bannerWarningBg: 'red-mock',
  bannerWarningBorder: 'darkred-mock',
  bannerWarningText: 'white-mock',
  bannerInfoBg: 'green-mock',
  bannerInfoBorder: 'darkgreen-mock',
  bannerInfoText: 'white-mock',
};

jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(
  jest.fn()
);

describe('ConnectivityBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('rendering behavior', () => {
    it('renders offline message when online is false', () => {
      const { getByText } = render(<ConnectivityBanner online={false} colors={colors} />);

      expect(getByText(/You're offline/)).toBeTruthy();
    });

    it('renders back online message when online and wasOffline', () => {
      const { getByText } = render(<ConnectivityBanner online={true} wasOffline colors={colors} />);
      
      expect(getByText(/You're back online/)).toBeTruthy();
    });

    it('renders nothing when online is true and wasOffline is false', () => {
      const { toJSON } = render(<ConnectivityBanner online={true} wasOffline={false} colors={colors} />);

      expect(toJSON()).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('uses alert role when offline', () => {
      const { getByTestId } = render(<ConnectivityBanner online={false} colors={colors} />);

      expect(getByTestId('connectivity-banner').props.accessibilityRole).toBe('alert');
    });

    it('announces offline state', () => {
      render(<ConnectivityBanner online={false} colors={colors} />);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith(
        "You're offline. Globe view and some features are unavailable."
      );
    });

    it('announces back online state', () => {
      render(<ConnectivityBanner online={true} wasOffline colors={colors} />);

      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenLastCalledWith(
        "You're back online. Globe view is available."
      );
    });
  });
});