import { getAppVersion } from '../getAppVersion';
import { NativeModules } from 'react-native';

describe('getAppVersion', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        NativeModules.AppVersion = {
            getVersion: jest.fn(),
        };
    });

    it('returns Native Module version', async () => {
        (NativeModules.AppVersion.getVersion as jest.Mock).mockResolvedValue('1.0.0');
        const version = await getAppVersion();

        expect(version).toBe('1.0.0');
    });
});