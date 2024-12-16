<template>
  <div class="menubar">
    <changepassword
      v-if="changeVisible"
      :isVisible="changeVisible"
      @close="changeVisible = false"
    />
    <i class="pi pi-times close-icon" @click="this.$emit('close')"></i>
    <div class="menu-links col">
      <div class="main-links col">
        <router-link to="/capstone-directory?page=0&is_approved=true"
          >Home</router-link
        >
        <!-- <router-link
          to="/capstone-directory?page=0&is_approved=true&is_ip_registered=true"
          >IP-Registered</router-link
        > -->
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          to="/upload"
          >Upload</router-link
        >
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          :to="`/capstone-directory?page=0&is_approved=pending&course=${course}`"
          >Approvals</router-link
        >
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          :to="`/capstone-directory?page=0&is_approved=false&course=${course}`"
          >Rejects</router-link
        >
      </div>
      <div class="admin-links col">
        <router-link v-if="role === 'administrator'" to="/activity-logs"
          >Logs</router-link
        >
        <router-link
          v-if="role === 'administrator' || role === 'capstone coordinator'"
          to="/users"
          >Users</router-link
        >
        <router-link
          v-if="role === 'administrator' || role === 'capstone coordinator'"
          to="/groups"
          >Groups</router-link
        >
      </div>
    </div>
    <div class="user-links col">
      <p v-if="token" @click="changeVisible = true">Change Password</p>
      <p @click="logout" v-if="token">Logout</p>
      <p
        @click="
          () => {
            this.$router.push('/login');
          }
        "
        v-else
      >
        Login
      </p>
    </div>
  </div>
</template>

<script>
import changepassword from "@/components/menubar/dialogs/changepassword.vue";
export default {
  components: { changepassword },
  data() {
    return {
      role: null,
      token: null,
      course: null,
      changeVisible: false,
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
          this.$router.push("/login");
          localStorage.clear();
        },
        reject: () => {},
      });
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
    this.token = localStorage.getItem("token");
    this.course = localStorage.getItem("course");
  },

  watch: {
    "$route.path": {
      handler(newValue) {
        this.$emit("close");
      },
    },
    "$route.query": {
      handler(newValue) {
        this.$emit("close");
      },
    },
  },
};
</script>

<style></style>
