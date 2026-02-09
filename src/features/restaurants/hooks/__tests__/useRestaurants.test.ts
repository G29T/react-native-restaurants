import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRestaurants } from "../../../../core/api/fetchRestaurants";
import { Restaurant } from "../../types";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useRestaurants } from "../useRestaurants";
import { subscribeToNetwork } from "../../../../core/network/state/networkState";

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('../../../../core/network/state/networkState', () => ({
  subscribeToNetwork: jest.fn(),
}));

let networkCallback: (online: boolean) => void;

(subscribeToNetwork as jest.Mock).mockImplementation((callback) => {
  networkCallback = callback;
  return jest.fn(); 
});

jest.mock('../../../../core/api/fetchRestaurants', () => ({
  fetchRestaurants: jest.fn(),
}));

const asyncStorageGet = AsyncStorage.getItem as jest.Mock;
const asyncStorageSet = AsyncStorage.setItem as jest.Mock;
const mockedFetchRestaurantList = fetchRestaurants as jest.Mock;

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

describe('useRestaurants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches fresh data when online and no cache', async () => {
    asyncStorageGet.mockResolvedValue(null);
    asyncStorageSet.mockResolvedValue(null);
    mockedFetchRestaurantList.mockResolvedValue(mockRestaurants);

    const { result } = renderHook(() => useRestaurants('UK'));

    act(() => networkCallback(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.restaurants).toEqual(mockRestaurants);
    expect(result.current.offline).toBe(false);
    expect(result.current.error).toBeNull();
    expect(asyncStorageSet).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('Sea Food Restaurant')
    );
  });

  it('uses cache when offline', async () => {
    asyncStorageGet.mockResolvedValue(
      JSON.stringify({ timestamp: Date.now(), restaurants: mockRestaurants })
    );

    const { result } = renderHook(() => useRestaurants('UK'));

    act(() => networkCallback(false));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.restaurants).toEqual(mockRestaurants);
    expect(result.current.offline).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('fetches fresh data when cache is expired and device is online', async () => {
    const expiredCacheTimestamp = Date.now() - 5 * 60 * 60 * 1000;

    asyncStorageGet.mockResolvedValue(
      JSON.stringify({ timestamp: expiredCacheTimestamp, restaurants: mockRestaurants })
    );
    mockedFetchRestaurantList.mockResolvedValue(mockRestaurants);
    asyncStorageSet.mockResolvedValue(null);

    const { result } = renderHook(() => useRestaurants('UK'));

    act(() => networkCallback(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.restaurants).toEqual(mockRestaurants);
    expect(result.current.offline).toBe(false);
  });

  it('returns empty array for non-UK country', async () => {
    asyncStorageGet.mockResolvedValue(null);
    mockedFetchRestaurantList.mockResolvedValue(mockRestaurants);
    asyncStorageSet.mockResolvedValue(null);

    const { result } = renderHook(() => useRestaurants('USA'));

    act(() => networkCallback(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.restaurants).toEqual([]);
  });

  it('sets error on API failure', async () => {
    asyncStorageGet.mockResolvedValue(null);
    mockedFetchRestaurantList.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useRestaurants('UK'));

    act(() => networkCallback(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('API Error');
    expect(result.current.restaurants).toEqual([]);
  });

  it('does not update state after unmount', async () => {
    asyncStorageGet.mockResolvedValue(null);
    mockedFetchRestaurantList.mockResolvedValue(mockRestaurants);
    asyncStorageSet.mockResolvedValue(null);

    const { result, unmount } = renderHook(() => useRestaurants('UK'));
    
    act(() => networkCallback(true));
    unmount();

    await new Promise<void>(resolve => setTimeout(resolve, 20));

    expect(result.current.restaurants).toEqual([]);
  });
});