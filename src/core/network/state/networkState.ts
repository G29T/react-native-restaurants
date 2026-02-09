import NetInfo from '@react-native-community/netinfo';

let forcedStatus: boolean | null = null;

/*
  Override network status for tests only
  true = online, false = offline, null = use real device state
*/
export const forceNetworkStatus = (online: boolean | null) => {
  forcedStatus = online;
};

// Uses real NetInfo when no forced state is set
export const subscribeToNetwork = (callback: (online: boolean) => void) => {
  // Test override
  if (forcedStatus !== null) {
    callback(forcedStatus);
    return () => {};
  }

  // Real device network state
  const unsubscribe = NetInfo.addEventListener(state => {
    callback(!!state.isConnected);
  });

  return unsubscribe;
};