import { useEffect, useState } from "react";
import { Restaurant } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRestaurants } from "../../../core/api/fetchRestaurants";
import { subscribeToNetwork } from "../../../core/network/state/networkState";

const CACHE_KEY = 'restaurant_list_cache_v1';
const CACHE_TTL = 5 * 60 * 60 * 1000;

type CachedPayloadProp = {
  timestamp: number;
  restaurants: Restaurant[]; 
};

export const useRestaurants = (countryId: string) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let isOnline = true;

    const unsubscribe = subscribeToNetwork(online => {
      isOnline = online;
      if (isMounted) {
        setOffline(!online);
      }
    });

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);

        let restaurants: Restaurant[] | null = null;
        const storedCache = await AsyncStorage.getItem(CACHE_KEY);

        if (storedCache) {
          const cached: CachedPayloadProp = JSON.parse(storedCache);
          const isCacheExpired = Date.now() - cached.timestamp > CACHE_TTL;

          if (!isCacheExpired || !isOnline) {
            restaurants = cached.restaurants;
          }
        }

        //  Fetch fresh restaurants if: no valid cache and the device is online
        if (!restaurants && isOnline) {
          const fresh = await fetchRestaurants();

          // Store fresh restaurants in cache
          await AsyncStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              restaurants: fresh,
            })
          );

          restaurants = fresh;
        }

        if (!restaurants) {
          throw new Error('No restaurants available');
        }

        if (!isMounted) return;

        /*
          Filter restaurants by country 
          Currently only UK data is available
          The logic will adjust if restaurants from other countries become available
        */
        setRestaurants(countryId === 'UK' ? restaurants : []);

      } catch (err: unknown) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRestaurants();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [countryId]); 

  return { restaurants, loading, error, offline };
};