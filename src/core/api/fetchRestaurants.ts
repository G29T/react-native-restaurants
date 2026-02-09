import { Restaurant } from "../../features/restaurants/types";

const url = 'https://storage.googleapis.com/nandos-engineering-public/coding-challenge-rn/restaurantlist.json';

// Choose fetch because this is a simple GET request 
// Fetch is built-in, lightweight, and requires no extra dependencies
export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    if (!json?.data?.restaurant?.items) {
      throw new Error('Unexpected response structure');
    }

    return json.data.restaurant.items;
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown fetch error');
    throw err;
  }
};