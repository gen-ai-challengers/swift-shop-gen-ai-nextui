

<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form">
      <h3 class="text-h6 mb-4">Verify Your Phone</h3>

      <div class="text-body-2">
        We sent a verification code to phone number<br />

        Please check your phone and paste the code below.
      </div>

      <v-otp-input
        v-model="otp"
        type="text"
        variant="solo"
        :loading="loading"
        length="6"
        :rules="otpRules"
        autocomplete="one-time-code"
        :error="!!otpRules.find((rule) => rule(otp))"
      ></v-otp-input>

      <div class="d-flex flex-column">
        <v-btn
          class="mt-4"
          :loading="loading"
          color="success"
          block
          @click="validate"
        >
          Proceed
        </v-btn>

        <v-btn
          class="mt-4"
          color="primary"
          size="x-small"
          text="Send New Code"
          variant="text"
          @click="otp = ''"
        ></v-btn>
        <v-btn
          class="mt-4"
          color="error"
          size="x-small"
          text="Change phone number"
          variant="text"
          to="/register"
        ></v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
<script setup lang="ts">
const otp = ref("");

const loading = ref<boolean>(false);
const form = ref<HTMLFormElement | null>(null);
const $toast = useToast();

const $router = useRouter();

const { sendOTP, verifyOTP } = useFirebaseAuth();

console.log("otp");
console.log($router);
console.log($toast);

const otpRules = [
  (v: string) => !!v || "OTP is required",
  (v: string) => (v && v.length === 6) || "OTP must be exactly 6 characters",
  (v: string) => /^[0-9]*$/.test(v) || "Phone number must be numeric",
];

const { registerUser, $state } = useUserStore();

onMounted(async () => {
  console.log("mounted otp");
  if (!$state.userRegister?.phone) {
    $router.push("/register");
  }
  try {
    console.log("sending otp");
    loading.value = true;
    await sendOTP(("+" + $state.userRegister?.phone) as string, 'grecaptcha');
    console.log("sent otp");
  } catch (error) {
    console.error(error);
    $toast.error(error);
  } finally {
    loading.value = false;
  }
});

const validate = async () => {
  let valid = true;
  console.log("otp", otp.value);
  otpRules.forEach((rule) => {
    if(!valid) return;
    const error = rule(otp.value);
    
    console.log("error", error);
    if (error !== true) {
      $toast.error(new Error(error as string));
      valid = false;
    }
  });
  console.log("valid", valid);
  if (valid) {
    try {
      loading.value = true;
      await verifyOTP(otp.value);
      await registerUser();
      $router.push("/add-face");
    } catch (error) {
      $toast.error(error);
    } finally {
      loading.value = false;
    }
  }
};

const reset = () => {
  form.value && form.value.reset();
};

const resetValidation = () => {
  form.value && resetValidation();
};
</script>