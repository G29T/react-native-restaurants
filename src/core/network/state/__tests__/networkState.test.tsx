import NetInfo from '@react-native-community/netinfo';
import { subscribeToNetwork, forceNetworkStatus } from '../networkState';

jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
}));

describe('networkState', () => {
    let callback: (online: boolean) => void;
    let unsubscribeMock: jest.Mock;

    beforeEach(() => {
        forceNetworkStatus(null);

        unsubscribeMock = jest.fn();
        callback = jest.fn();

        (NetInfo.addEventListener as jest.Mock).mockImplementation((callback) => {
            callback({ isConnected: true });
            return unsubscribeMock;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls callback immediately when forcedStatus is set', () => {
        forceNetworkStatus(false);

        const unsubscribe = subscribeToNetwork(callback);

        expect(callback).toHaveBeenCalledWith(false);
        expect(unsubscribe).toBeInstanceOf(Function);
    });

    it('uses real NetInfo if forcedStatus is null', () => {
        const unsubscribe = subscribeToNetwork(callback);

        expect(NetInfo.addEventListener).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(true);
        expect(unsubscribe).toBe(unsubscribeMock);
    });

    it('allows setting forcedStatus to null again', () => {
        forceNetworkStatus(true);
        let unsubscribe = subscribeToNetwork(callback);

        expect(callback).toHaveBeenCalledWith(true);

        forceNetworkStatus(null);
        unsubscribe = subscribeToNetwork(callback);

        expect(NetInfo.addEventListener).toHaveBeenCalled();
    });
});