<template>
  <div class="menubar">
    <ConfirmDialog></ConfirmDialog>
    <i class="pi pi-times close-icon" @click="this.$emit('close')"></i>
    <div class="menu-links col">
      <div class="main-links col">
        <router-link to="/">Home</router-link>
        <router-link to="/">IP-Registered</router-link>
        <router-link to="/">Upload</router-link>
        <router-link to="/">Approvals</router-link>
      </div>
      <div class="admin-links col">
        <router-link to="/users">Users</router-link>
        <router-link to="/">Groups</router-link>
      </div>
    </div>
    <div class="user-links col">
      <p to="/">Profile</p>
      <p @click="logout">Logout</p>
    </div>
  </div>
</template>

<script>
export default {
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
          localStorage.clear();
          this.$router.push("/login");
        },
        reject: () => {},
      });
    },
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
