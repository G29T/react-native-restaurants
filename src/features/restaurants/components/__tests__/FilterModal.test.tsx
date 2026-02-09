import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterModal } from '../FilterModal';

  const colors = {
    surface: 'mock-surface',
    textPrimary: 'mock-text',
  };

  const options = ['Option1', 'Option2'];

describe('FilterModal', () => {
  let onSelectMock: jest.Mock;
  let onCloseMock: jest.Mock;
  let defaultProps: Parameters<typeof FilterModal>[0];

  beforeEach(() => {
    onSelectMock = jest.fn();
    onCloseMock = jest.fn();

    defaultProps = {
      visible: true,
      title: 'Select Item',
      options,
      onSelect: onSelectMock,
      onClose: onCloseMock,
      colors,
    };
  });

  
  describe('rendering and behavior', () => {
    it('renders title and options when visible', () => {
      const { getByText, getByTestId } = render(<FilterModal {...defaultProps} />);

      expect(getByText('Select Item')).toBeTruthy();
      expect(getByText('All')).toBeTruthy();
      expect(getByTestId('modal-option-Option1')).toBeTruthy();
      expect(getByTestId('modal-option-Option2')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(<FilterModal {...defaultProps} visible={false} />);

      expect(queryByText('Select Item')).toBeNull();
    });

    it('calls onSelect with null when ALL is pressed', () => {
      const { getByTestId } = render(<FilterModal {...defaultProps} />);

      fireEvent.press(getByTestId('modal-option-ALL'));

      expect(onSelectMock).toHaveBeenCalledWith(null);
    });

    it('calls onSelect with option value when an option is pressed', () => {
      const { getByTestId } = render(<FilterModal {...defaultProps} />);

      fireEvent.press(getByTestId('modal-option-Option1'));

      expect(onSelectMock).toHaveBeenCalledWith('Option1');
    });

    it('uses mapIdToLabel when provided', () => {
      const mapIdToLabel = (value: string) => `Label:${value}`;
      const { getByText } = render(
        <FilterModal {...defaultProps} mapIdToLabel={mapIdToLabel} />
      );

      expect(getByText('Label:Option1')).toBeTruthy();
      expect(getByText('Label:Option2')).toBeTruthy();
    });

    it('calls onClose when backdrop is pressed', () => {
      const { getByTestId } = render(<FilterModal {...defaultProps} />);

      fireEvent.press(getByTestId('modal-backdrop'));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => { 
    it('backdrop has correct accessibility props', () => {
      const { getByTestId } = render(<FilterModal {...defaultProps} />);
      const backdrop = getByTestId('modal-backdrop');

      expect(backdrop.props.accessible).toBe(true);
      expect(backdrop.props.accessibilityLabel).toBe('Close modal');
    });

    it('title has correct accessibility role', () => {
      const { getByTestId } = render(<FilterModal {...defaultProps} />);
      const title = getByTestId('modal-title');

      expect(title.props.accessibilityRole).toBe('header');
    });

    it('option buttons have correct accessibility props', () => {
      const mapIdToLabel = (value: string) => `Label:${value}`;

      const { getByTestId } = render(<FilterModal {...defaultProps} mapIdToLabel={mapIdToLabel} />);

      const allOption = getByTestId('modal-option-ALL');
      expect(allOption.props.accessibilityRole).toBe('button');
      expect(allOption.props.accessibilityLabel).toBe('All options');

      const option1 = getByTestId('modal-option-Option1');
      expect(option1.props.accessibilityRole).toBe('button');
      expect(option1.props.accessibilityLabel).toBe('Label:Option1');
    });
  });
});