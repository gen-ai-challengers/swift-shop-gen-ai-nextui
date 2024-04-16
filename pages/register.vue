<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form">
      <v-text-field
        autocomplete="one-time-code"
        v-model="name"
        :counter="30"
        :rules="nameRules"
        label="Name"
        prepend-icon="mdi-account"
        required
        clear-icon="mdi-close"
        clearable
        variant="underlined"
      ></v-text-field>

      <v-text-field
        autocomplete="one-time-code"
        v-model="phone"
        :counter="15"
        :rules="phoneRules"
        label="Phone Number"
        prepend-icon="mdi-phone"
        required
        clear-icon="mdi-close"
        clearable
        variant="underlined"
      ></v-text-field>

      <v-text-field
        autocomplete="one-time-code"
        v-model="password"
        :counter="15"
        :rules="passwordRules"
        label="Password"
        prepend-icon="mdi-lock"
        required
        clear-icon="mdi-close"
        clearable
        variant="underlined"
        :append-icon="mdiIcon"
        :type="inputType"
        @click:append="showHide"
      ></v-text-field>

      <v-checkbox
        v-model="checkbox"
        :rules="[(v) => !!v || 'You must agree to continue!']"
        label="Do you agree?"
        required
      ></v-checkbox>

      <div class="d-flex flex-column">
        <v-btn class="mt-4" color="success" block @click="validate">
          Register
        </v-btn>

        <v-btn class="mt-4" color="error" block @click="reset">
          Reset Form
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
<script>
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../stores/user";
export default {
  data: () => ({
    inputType: "password",
    mdiIcon: "mdi-eye",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 15) || "Name must be less than 15 characters",
      (v) => (v && v.length >= 3) || "Name must be more than 3 characters",
      (v) => /^[a-zA-Z 0-9]*$/.test(v) || "Name must be alphanumeric",
    ],
    phoneRules: [
      (v) => !!v || "Phone number is required",
      (v) =>
        (v && v.length <= 15 && v.length >= 10) ||
        "Phone number must be between 10 and 15 characters",
      (v) => /^[0-9]*$/.test(v) || "Phone number must be numeric",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 15 && v.length >= 8) ||
        "Password must be between 8 and 15 characters",
      (v) => /^[a-zA-Z 0-9]*$/.test(v) || "Password must be alphanumeric",
    ],
    checkbox: false,
  }),
  computed: {
    ...mapState(useUserStore, ["userRegister"]),
    name: {
      get() {
        return this.userRegister?.name || "";
      },
      set(value) {
        this.setUserRegister({
          name: value,
          phone: this.phone,
          password: this.password,
        });
      },
    },
    phone: {
      get() {
        return this.userRegister?.phone || "";
      },
      set(value) {
        this.setUserRegister({
          name: this.name,
          phone: value,
          password: this.password,
        });
      },
    },
    password: {
      get() {
        return this.userRegister?.password || "";
      },
      set(value) {
        this.setUserRegister({
          name: this.name,
          phone: this.phone,
          password: value,
        });
      },
    },
  },
  methods: {
    ...mapActions(useUserStore, ["setUserRegister"]),
    showHide() {
      this.inputType = this.inputType === "password" ? "text" : "password";
      this.mdiIcon = this.inputType === "password" ? "mdi-eye" : "mdi-eye-off";
    },
    async validate() {
      try {
        const { valid } = await this.$refs.form.validate();

        if (valid) {
          this.$router.push("/otp");
        }
      } catch (e) {
        this.$toast.error(e);
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