import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from '../RestaurantCard';
import { Linking } from 'react-native';

jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

const mockRestaurant = {
  name: 'Italian Restaurant',               
  url: 'https://italian-restaurant.com',         
  geo: {
    address: {
      streetAddress: '12 Test St',     
      addressLocality: 'Test City',     
    },
  },
} as any; 

const mockColors = {
  surface: 'mock-surface',
  accent: 'mock-accent',
  textPrimary: 'mock-text-primary',
  textSecondary: 'mock-text-secondary',
};

describe('RestaurantCard', () => {
  const renderRestaurantCard = () =>
    render(
      <RestaurantCard
        testID="restaurant-card"
        restaurant={mockRestaurant}
        colors={mockColors}
        theme="light"
      />
    );

  afterEach(() => jest.clearAllMocks());

  it('renders restaurant details correctly', () => {
    const { getByTestId } = renderRestaurantCard();

    expect(getByTestId('restaurant-card-name').props.children).toBe('Italian Restaurant');
    expect(getByTestId('restaurant-card-street').props.children).toBe('12 Test St');
    expect(getByTestId('restaurant-card-city').props.children).toBe('Test City');
    expect(getByTestId('restaurant-card-arrow-link-icon')).toBeTruthy();
  });

  it('opens URL on press', () => {
    const { getByTestId } = renderRestaurantCard();

    fireEvent.press(getByTestId('restaurant-card'));

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith('https://italian-restaurant.com');
  });

  it('has correct accessibility props', () => {
    const { getByTestId } = renderRestaurantCard();
    const card = getByTestId('restaurant-card');

    expect(card.props.accessible).toBe(true);
    expect(card.props.accessibilityRole).toBe('button');
    expect(card.props.accessibilityLabel).toBe('Restaurant: Italian Restaurant. Tap to view details.');
  });
});