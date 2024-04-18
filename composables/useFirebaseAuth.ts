import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import type { User, Auth, ConfirmationResult } from "firebase/auth";

export default function () {
  const { $auth } = useNuxtApp();

  const auth: Auth = $auth as Auth;

  const user = useState<User | null>("fb_user", () => null);

  const recaptchaVerifier = useState<RecaptchaVerifier | null>();

  const confirmationResult = useState<ConfirmationResult | null>();

  const sendOTP = async (
    phoneNumber: string,
    containerOrId: HTMLElement | string
  ): Promise<void> => {
    try {
      console.log("sending otp", phoneNumber);

      recaptchaVerifier.value = new RecaptchaVerifier(auth, containerOrId, {
        size: "invisible",
        callback: (response: any) => {
          console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("recaptcha solved");
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("recaptcha expired");
          throw new Error("Recaptcha expired");
        },
      });

      confirmationResult.value = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.value as RecaptchaVerifier
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // handle error
        console.error(error);
      }
      throw error;
    }
  };

  const verifyOTP = async (otp: string): Promise<void> => {
    try {
      console.log("verifying otp >>> ", otp);
      console.log(confirmationResult.value);
      const userCreds = await confirmationResult.value?.confirm(otp);
      console.log(userCreds);
      if (userCreds) {
        user.value = userCreds.user;
      }
    } catch (error: unknown) {
      console.log("error verifying otp", error);
      if (error instanceof Error) {
        console.log(error);
        // handle error
      }
      throw error;
    }
  };

  return {
    user,
    sendOTP,
    verifyOTP,
  };
}
