import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'movie_database',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // Jak dlouho se zobrazuje (ms)
      launchAutoHide: true,     // Automaticky schovat?
      backgroundColor: "#ffffff", // Barva pozadí (hex) - měla by ladit se splash.png
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,       // Zda ukazovat točící se kolečko
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;