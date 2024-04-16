import { defineStore } from "pinia";
import type { User, UserRegister } from "~/models/user";
import type { FaceData } from "~/models/face";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    isLoggedIn: false,
    userData: null as User | null,
    userRegister: null as UserRegister | null,
  }),
  actions: {
    async doLogin(userLogin: UserRegister) {
      await $fetch("/api/login/", {
        method: "POST",
        body: JSON.stringify(userLogin),
      });
      await this.getUser();
      this.isLoggedIn = true;
    },
    async getUser() {
      try {
        console.log("getting user data");
        const user: User = await $fetch("/api/v1/users/me/");
        this.userData = user;
        this.isLoggedIn = true;
      } catch (error: any) {
        console.error(error);
        if (error.response.status === 401) {
          this.isLoggedIn = false;
          this.userData = null;
          return;
        }
        throw error;
      }
    },
    async doLogout() {
      await $fetch("/api/logout/", {
        method: "POST",
      });
      this.isLoggedIn = false;
    },
    async registerUser() {
      console.log(this.userRegister);
      await $fetch("/api/register/", {
        method: "POST",
        body: JSON.stringify(this.userRegister),
      });
      await this.getUser();
      this.isLoggedIn = true;
    },
    toFormData(dataUrl: string) {
      const arr = dataUrl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "image.jpg", { type: mime });
      const formData = new FormData();
      formData.append("file", file);
      return formData;
    },
    async addFace(face: FaceData) {
      const formData = this.toFormData(face.dataUrl);

      await $fetch(`/api/v1/users/${this.userData?.id}/add-face/`, {
        method: "POST",
        body: formData,
      });
    },
    async recognizeFaceAndLogin(face: FaceData) {
      console.log("recognizing face and login");
      const formData = this.toFormData(face.dataUrl);

      await $fetch(`/api/recognize/`, {
        method: "POST",
        body: formData,
      });
      await this.getUser();
    },
    setUserRegister(userRegister: UserRegister) {
      this.userRegister = userRegister;
    },
  },
});
