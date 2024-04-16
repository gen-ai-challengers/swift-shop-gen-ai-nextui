import { defineStore } from "pinia";
import type { Notification } from "~/models/notification";

export const useNotificationStore = defineStore("notificationStore", {
  state: () => ({
    notification: null as Notification | null,
  }),
  actions: {
    setNotification(notification: Notification) {
      console.log("setting notification", notification);  
      this.notification = notification;
    },
    setVisiblity(visible: boolean) {
      if (this.notification) {
        this.notification.visible = visible;
      }
    },
  },
});
