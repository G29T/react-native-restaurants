import NetInfo from '@react-native-community/netinfo';

export const subscribeToNetwork = (callback: (online: boolean) => void) => {
    const unsubscribe = NetInfo.addEventListener(state => {
    callback(!!state.isConnected);
  });

  return unsubscribe;
};