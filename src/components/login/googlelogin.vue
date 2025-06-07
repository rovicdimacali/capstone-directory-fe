<template>
  <div id="google-signin-button"></div>
</template>

<script>
import { auth } from "@/api/auth";
export default {
  data() {
    return {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    };
  },

  mounted() {
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse,
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      {
        theme: "outline",
        size: "large",
      }
    );
  },

  methods: {
    async handleCredentialResponse(grepsonse) {
      this.$emit("loading");
      try {
        const response = await auth.googleLogin({
          access_token: grepsonse.credential,
        });

        if (response) {
          localStorage.setItem("token", response.access_token);
          const me = await auth.me();

          if (me) {
            localStorage.setItem("role", me?.role);
            localStorage.setItem("email", me?.email);
            localStorage.setItem("course", me?.course);
            localStorage.setItem("specialization", me?.specialization);
            localStorage.setItem("first_name", me?.first_name);
            localStorage.setItem("group", me?.group?.number);
            localStorage.setItem("academic_year", me?.group?.academic_year);

            this.$router.push("/capstone-directory?page=0&is_approved=true");
          }
        }
      } catch (error) {
        this.$emit("stopLoading");
        console.error("error", error.response.data.message);
        this.$emit("error", error.response.data.message);
      }
    },
  },
};
</script>
