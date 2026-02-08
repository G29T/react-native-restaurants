import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterButton } from '../FilterButton';

jest.mock('../../../../core/theme/context/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('FilterButton', () => {
  let onPressMock: jest.Mock;

  beforeEach(() => {
    onPressMock = jest.fn();
    jest.clearAllMocks();
  });

  it('renders label and value', () => {
    const { getByTestId, getByText } = render(
      <FilterButton label="Continent" value="Europe" onPress={onPressMock} />
    );

    expect(getByTestId('filter-continent')).toBeTruthy();
    expect(getByText(/Continent:/)).toBeTruthy();
    getByText('Continent: Europe')
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <FilterButton label="Country" value="UK" onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('filter-country'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});