// create toast using vutify snackbar

export default defineNuxtPlugin((app) => {
  console.log("toast plugin");
  console.log(app);
  app.provide("toast", {
    show: (message: string) => {
      console.log("showing toast", message);
      useNotificationStore().setNotification({
        message,
        color: "success",
        icon: "mdi-check",
        closable: true,
        timeout: 5000,
        visible: true,
      });
    },
    error: (data: any) => {
      console.log("showing error toast");
      console.log(data?.response?._data);
      const message = data?.response?._data?.errors?.[0] || data.message || "An error occurred !";
      console.log(message);
      useNotificationStore().setNotification({
        message,
        color: "error",
        icon: "mdi-alert",
        closable: true,
        timeout: 10000,
        visible: true,
      });
    },
  });
});
