import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eparking.app',
  appName: 'E-Parking',
  webDir: 'dist/e-parking/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
