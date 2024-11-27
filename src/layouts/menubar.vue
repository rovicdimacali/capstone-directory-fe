<template>
  <div class="menubar">
    <i class="pi pi-times close-icon" @click="this.$emit('close')"></i>
    <div class="menu-links col">
      <div class="main-links col">
        <router-link to="/capstone-directory">Home</router-link>
        <router-link to="/ip-registered">IP-Registered</router-link>
        <router-link to="/upload">Upload</router-link>
        <router-link to="/approvals">Approvals</router-link>
      </div>
      <div class="admin-links col">
        <router-link v-if="role !== 'student'" to="/users">Users</router-link>
        <router-link v-if="role !== 'student'" to="/groups">Groups</router-link>
      </div>
    </div>
    <div class="user-links col">
      <p>Profile</p>
      <p @click="logout">Logout</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: null,
    };
  },
  methods: {
    logout() {
      this.$confirm.require({
        message: "Are you sure you want to logout?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "No",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Yes",
        },
        accept: () => {
          if (localStorage.getItem("role") === "Student") {
            this.$router.push("/login");
          } else {
            this.$router.push("/cics-admin");
          }
          localStorage.clear();
        },
        reject: () => {},
      });
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
  },

  watch: {
    "$route.path": {
      handler(newValue) {
        this.$emit("close");
      },
    },
  },
};
</script>

<style></style>
