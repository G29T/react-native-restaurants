import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActionButton } from '../ActionButton';
import { useTheme } from '../../../../core/theme/context/ThemeProvider';

jest.mock('../../../../core/theme/context/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

describe('ActionButton', () => {
  let onPressMock: jest.Mock;

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
    onPressMock = jest.fn();
  });
  
  it('renders label and icon', () => {
    const { getByText, getByTestId } = render(
      <ActionButton label="Click" icon="home" testID="home-button" onPress={() => {}} />
    );

    expect(getByText('Click')).toBeTruthy();
    expect(getByTestId('home-button')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ActionButton label="Click" icon="home" onPress={onPress} testID="home-button" />
    );

    fireEvent.press(getByTestId('home-button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ActionButton label="Click" icon="home" onPress={onPress} testID="home-button" disabled />
    );

    fireEvent.press(getByTestId('home-button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});