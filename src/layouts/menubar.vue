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
        <router-link
          to="/capstone-directory?page=0&is_approved=true&is_ip_registered=true"
          >IP-Registered</router-link
        >
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          to="/upload"
          >Upload</router-link
        >
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          :to="`/capstone-directory?page=0&is_approved=pending${
            role === 'student' && course ? `&course=${course}` : ''
          }`"
          style="position: relative"
          >Pending Submissions
          <Badge
            v-if="role === 'administrator'"
            :value="approvalCount"
            style="
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 30px;
            "
        /></router-link>
        <router-link
          v-if="role === 'student' || role === 'administrator'"
          :to="`/capstone-directory?page=0&is_approved=false&course=${course}`"
          >Declined</router-link
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
import { capstone } from "@/api/capstone";
export default {
  components: { changepassword },
  data() {
    return {
      role: null,
      token: null,
      course: null,
      changeVisible: false,
      approvalCount: null,
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

    async fetchApprovals() {
      try {
        const response = await capstone.getApprovals();
        this.approvalCount = response.count;
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
    this.token = localStorage.getItem("token");
    this.course = localStorage.getItem("course");
    this.fetchApprovals();
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
