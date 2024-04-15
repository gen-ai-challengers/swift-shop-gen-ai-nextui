// create toast using vutify snackbar

export default defineNuxtPlugin((app) => {
  console.log("toast plugin");
  console.log(app);
  app.provide("toast", {
    show: (data: { message: string }) => {
      console.log("showing toast");
      alert(data.message);
    },
    error: (data: { message: string }) => {
      console.log("showing error toast");
      alert(data.message);
    },
  });
});
