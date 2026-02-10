import { NativeModules } from 'react-native';

type AppVersionModule = {
  getVersion(): Promise<string>;
};

export async function getAppVersion(): Promise<string> {
  const NativeAppVersion = NativeModules.AppVersion as AppVersionModule | undefined;

  if (!NativeAppVersion?.getVersion) {
    return 'unknown';
  }

  return NativeAppVersion.getVersion();
}