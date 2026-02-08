import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { subscribeToNetwork } from '../state/networkState';

type NetworkContextValue = {
    isDeviceOnline: boolean;
    wasDeviceOffline: boolean;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isDeviceOnline, setIsDeviceOnline] = useState(true); 
    const [wasDeviceOffline, setWasDeviceOffline] = useState(false); 
    const prevNetworkOnlineRef = useRef<boolean | null>(null);


    useEffect(() => {
        const unsubscribe = subscribeToNetwork((online) => {
            setIsDeviceOnline(online);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (prevNetworkOnlineRef.current === false && isDeviceOnline === true) {
            setWasDeviceOffline(true);
        }

        prevNetworkOnlineRef.current = isDeviceOnline;
    }, [isDeviceOnline]);

    return (
        <NetworkContext.Provider value={{ isDeviceOnline, wasDeviceOffline }}>
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetworkInfo() {
  const networkContext = useContext(NetworkContext);

  if (!networkContext) {
    throw new Error('useNetworkInfo must be used within NetworkProvider');
  }

  return networkContext;
}