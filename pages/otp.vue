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
        length="4"
        :rules="otpRules"
        autocomplete="one-time-code"
      ></v-otp-input>

      <div class="d-flex flex-column">
        <v-btn class="mt-4" color="success" block @click="validate">
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
<script>
import { mapActions } from "pinia";
export default {
  data: () => ({
    otp: "",
    otpRules: [
      (v) => !!v || "OTP is required",
      (v) => (v && v.length === 6) || "OTP must be exactly 6 characters",
      (v) => /^[0-9]*$/.test(v) || "Phone number must be numeric",
    ],
    checkbox: false,
  }),

  methods: {
    ...mapActions(useUserStore, ["registerUser"]),
    async validate() {
      const valid = this.$refs.form.validate();
      if (valid) {
        try{
        await this.registerUser();
        this.$router.push("/add-face");
        } catch (error) {
          this.$toast.error(error);
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>