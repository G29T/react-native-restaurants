module.exports = {
  preset: 'react-native',
  testMatch: ['**/?(*.)+(test|spec).(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {'^@/(.*)$': '<rootDir>/src/$1',},
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-native-async-storage' +
      '|react-native-vector-icons' +
      '|react-native-webview' +
      '|@react-navigation' +
      ')/)',
  ],
  verbose: true,
};