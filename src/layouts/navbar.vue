<template>
  <menubar
    :class="menubarActive ? 'active' : ''"
    @close="menubarActive = false"
  />
  <nav class="row">
    <div class="logo row">
      <img
        src="https://res.cloudinary.com/drayixmpk/image/upload/v1733590588/cics-logo_mi9jey.png"
      />
      <div class="col">
        <small>UST-CICS</small>
        <small>Capstone Directory</small>
      </div>
    </div>
    <div class="action-row row-10" style="align-items: center">
      <div v-if="token" class="user-info col">
        <p style="margin: 0">
          Hello, {{ first_name }}
          <span style="text-transform: capitalize">({{ role }})</span>
        </p>
        <small v-if="role === 'student'" style="color: grey"
          >Group: {{ group ? group : "Unassigned" }}</small
        >
      </div>
      <div v-if="token" class="notification-icon">
        <Button
          icon="pi pi-bell"
          text
          rounded
          raised
          @click="toggle"
          :badge="unreadCount"
          badgeSeverity="primary"
        />
        <Popover ref="op" style="padding: 0">
          <div
            class="flex flex-col gap-4"
            style="max-height: 500px; overflow-y: scroll"
          >
            <div>
              <span class="font-medium block mb-2">Notifications</span>
              <router-link
                v-for="notif in notifications"
                :key="notif.id"
                :to="
                  notif.action?.includes('best project')
                    ? '/capstone-directory?page=0&is_best_capstone=true&is_approved=true'
                    : notif.action?.includes('APPROVED')
                    ? '/capstone-directory?page=0&is_approved=true'
                    : notif.action?.includes('REJECTED')
                    ? '/capstone-directory?page=0&is_approved=false'
                    : ''
                "
                style="text-decoration: none; color: black"
              >
                <div
                  class="notification-col col-5"
                  @click="markAsRead(notif.id)"
                >
                  <p :class="notif.is_read ? '' : 'bold'">{{ notif.action }}</p>
                </div>
              </router-link>
            </div>
          </div>
        </Popover>
      </div>
      <div
        class="burger-icon"
        @click="
          () => {
            menubarActive = true;
          }
        "
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 8H13.75M5 12H19M10.25 16L19 16"
            stroke="#464455"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </nav>
</template>

<script>
import menubar from "./menubar.vue";
import { notification } from "@/api/notifications";
export default {
  components: { menubar },
  data() {
    return {
      menubarActive: false,
      notifications: null,
      unreadCount: 0,
      pollingInterval: null,
      first_name: null,
      role: null,
      group: null,
      token: null,
    };
  },

  methods: {
    toggle(event) {
      this.$refs.op.toggle(event);
    },

    async fetchNotifications() {
      try {
        const response = await notification.get();
        this.notifications = response.results;
        this.unreadCount = this.notifications.filter(
          (notification) => notification.is_read === false
        ).length;
      } catch (error) {
        console.error(error);
      }
    },

    async markAsRead(id) {
      try {
        await notification.mark_read(id);
        this.fetchNotifications();
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    // Fetch notifications immediately when mounted
    this.fetchNotifications();

    // Start polling every 3 seconds (3000ms)
    this.pollingInterval = setInterval(() => {
      this.fetchNotifications();
    }, 3000);

    this.token = localStorage.getItem("token");

    this.first_name = localStorage.getItem("first_name");
    this.role = localStorage.getItem("role");
    this.group =
      localStorage.getItem("group") !== "null"
        ? localStorage.getItem("group")
        : null;
  },

  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  },
};
</script>

<style></style>
