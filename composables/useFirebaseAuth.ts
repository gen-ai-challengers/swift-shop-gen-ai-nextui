import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import type { User, Auth, ConfirmationResult } from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  const auth: Auth = $auth as Auth;

  const user = useState<User | null>("fb_user", () => null);

  const recaptchaVerifier = useState<RecaptchaVerifier | null>();

  const confirmationResult = useState<ConfirmationResult | null>();

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      const respose = await new Promise((resolve, reject) => {
        recaptchaVerifier.value = new RecaptchaVerifier(
          auth,
          "sign-in-button",
          {
            size: "invisible",
            callback: (response: any) => {
              console.log(response);
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              resolve(response);
            },
            "expired-callback": () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              reject("expired");
            },
          }
        );
      });

      console.log(respose);
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.value as RecaptchaVerifier
      );

      console.log(confirmationResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
      }
      return false;
    }
    return false;
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const userCreds = await confirmationResult.value?.confirm(otp);
      if (userCreds) {
        user.value = userCreds.user;
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        // handle error
      }
      return false;
    }
    return false;
  };

  return {
    user,
    sendOTP,
    verifyOTP,
  };
}
