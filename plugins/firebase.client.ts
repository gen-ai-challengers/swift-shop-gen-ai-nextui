import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const config  = useRuntimeConfig();

  const firebaseConfig: FirebaseOptions = config.public.fb as FirebaseOptions;
  console.log(firebaseConfig);

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);
});
