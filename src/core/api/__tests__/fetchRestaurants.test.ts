import { Restaurant } from "../../../features/restaurants/types";
import { fetchRestaurants } from "../fetchRestaurants";

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

describe('fetchRestaurants', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('calls fetch with the correct URL', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { restaurant: { items: [] } },
      }),
    } as any);

    await fetchRestaurants();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String));
  });

  it('returns restaurant data when fetch succeeds with valid JSON', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { restaurant: { items: mockRestaurants } },
      }),
    } as any);

    const result = await fetchRestaurants();

    expect(result).toEqual(mockRestaurants);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('throws an error when fetch responds with non-OK HTTP responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as any);

    await expect(fetchRestaurants()).rejects.toThrow(
      'Failed to fetch data: 500 Internal Server Error'
    );
  });

  it('throws an error when JSON structure is invalid', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    } as any);

    await expect(fetchRestaurants()).rejects.toThrow(
      'Unexpected response structure'
    );
  });

  it('throws a generic error when fetch fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

    await expect(fetchRestaurants()).rejects.toThrow('Network failure');
  });

  it('returns empty array correctly', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ data: { restaurant: { items: [] } } }),
    } as any);

    const result = await fetchRestaurants();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});