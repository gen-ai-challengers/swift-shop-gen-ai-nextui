import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig: FirebaseOptions = {
    apiKey: config.FB_API_KEY as string | undefined,
    authDomain: config.FB_AUTH_DOMAIN as string | undefined,
    projectId: config.FB_PROJECT_ID as string | undefined,
    storageBucket: config.FB_STORAGE_BUCKET as string | undefined,
    messagingSenderId: config.FB_MESSAGING_SENDER_ID as string | undefined,
    appId: config.FB_APP_ID as string | undefined,
    measurementId: config.FB_MEASUREMENT_ID as string | undefined,
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);
});
