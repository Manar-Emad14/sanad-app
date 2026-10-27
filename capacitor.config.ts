import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sanad.dev',
  appName: 'Sanad Dev',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_name',
      iconColor: '#10b981',
      sound: 'cairo_adhan.mp3',
    },
  },
};

export default config;
