import { NativeModules } from 'react-native';

type AppVersionModule = {
  getVersion(): Promise<string>;
};

const NativeAppVersion = NativeModules.AppVersion as AppVersionModule | undefined;

export async function getAppVersion(): Promise<string> {
  if (!NativeAppVersion?.getVersion) {
    return 'unknown';
  }

  return NativeAppVersion.getVersion();
}