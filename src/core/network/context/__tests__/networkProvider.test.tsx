import { act, renderHook } from "@testing-library/react-native";
import { NetworkProvider, useNetworkInfo } from "../NetworkProvider";
import { subscribeToNetwork } from "../../state/networkState";

jest.mock('../../state/networkState', () => ({
  subscribeToNetwork: jest.fn(),
}));

let networkCallback: (online: boolean) => void;

(subscribeToNetwork as jest.Mock).mockImplementation((callback) => {
  networkCallback = callback;
  return jest.fn(); 
});

describe('NetworkProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial online state', () => {
    const { result } = renderHook(() => useNetworkInfo(), {
      wrapper: NetworkProvider
    });

    expect(result.current.isDeviceOnline).toBe(true);
    expect(result.current.wasDeviceOffline).toBe(false);
  });

  it('updates when going offline', () => {
    const { result } = renderHook(() => useNetworkInfo(), {
      wrapper: NetworkProvider
    });

    act(() => networkCallback(false));

    expect(result.current.isDeviceOnline).toBe(false);
    expect(result.current.wasDeviceOffline).toBe(false);
  });

  it('sets wasDeviceOffline after offline to online transition', async () => {
    const { result } = renderHook(() => useNetworkInfo(), {
      wrapper: NetworkProvider,
    });

    act(() => {
      networkCallback(false);
    });

    act(() => {
      networkCallback(true);
    });

    await act(async () => {});

    expect(result.current.isDeviceOnline).toBe(true);
    expect(result.current.wasDeviceOffline).toBe(true);
  });

  it('throws if useNetworkInfo is used outside NetworkProvider', () => {
    expect(() => renderHook(() => useNetworkInfo())).toThrow();
  });
});