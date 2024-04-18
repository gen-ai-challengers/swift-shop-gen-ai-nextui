import type { Toast } from "~/plugins/toast";

export default function () {
  const app = useNuxtApp();

  const $toast: Toast = app.$toast as Toast;

  return $toast;
}
