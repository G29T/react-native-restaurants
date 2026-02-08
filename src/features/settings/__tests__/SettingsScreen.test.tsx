import { fireEvent, render } from "@testing-library/react-native";
import { useTheme } from "../../../core/theme/context/ThemeProvider";
import SettingsScreen from "../SettingsScreen";

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('../../../core/theme/context/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = (selectedTheme: 'system' | 'light' | 'dark' = 'system', setSelectedThemeMock: jest.Mock) => {
  (useTheme as jest.Mock).mockReturnValue({
    selectedTheme,
    setSelectedTheme: setSelectedThemeMock,
    theme: selectedTheme === 'system' ? 'light' : selectedTheme,
  });
};

describe('SettingsScreen', () => {
  let setSelectedThemeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setSelectedThemeMock = jest.fn();
    mockUseTheme('system', setSelectedThemeMock);
  });

  describe('rendering and functionality', () => {
    it('renders all theme mode buttons', () => {
      const { getByTestId } = render(<SettingsScreen />);

      expect(getByTestId('settings-system')).toBeTruthy();
      expect(getByTestId('settings-light')).toBeTruthy();
      expect(getByTestId('settings-dark')).toBeTruthy();
    });

    it('calls setSelectedTheme when a mode button is pressed', () => {
      const { getByTestId } = render(<SettingsScreen />);

      fireEvent.press(getByTestId('settings-dark'));
      expect(setSelectedThemeMock).toHaveBeenCalledWith('dark');

      fireEvent.press(getByTestId('settings-light'));
      expect(setSelectedThemeMock).toHaveBeenCalledWith('light');

      fireEvent.press(getByTestId('settings-dark'));
      expect(setSelectedThemeMock).toHaveBeenCalledWith('dark');

      fireEvent.press(getByTestId('settings-system'));
      expect(setSelectedThemeMock).toHaveBeenCalledWith('system');
    });

    it('renders checkmark only for selected mode', () => {
      const { queryAllByTestId } = render(<SettingsScreen />);

      expect(queryAllByTestId('selected-icon')).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('buttons have correct accessibility props', () => {
      const { getByTestId } = render(<SettingsScreen />);

      const buttons = [
        { testID: 'settings-system', selected: true, label: 'system' },
        { testID: 'settings-light', selected: false, label: 'light' },
        { testID: 'settings-dark', selected: false, label: 'dark' },
      ];

      buttons.forEach(({ testID, selected, label }) => {
        const button = getByTestId(testID);
        expect(button.props.accessibilityRole).toBe('button');
        expect(button.props.accessibilityState.selected).toBe(selected);
        expect(button.props.accessibilityLabel).toBe(`Theme: ${label}`);
      });
    });
  });
});