<template>
  <div class="user-auth">
    <Toast />
    <div class="user-auth-box col">
      <div class="header">
        <div class="logo">
          <img
            src="https://res.cloudinary.com/dpm5vdakr/image/upload/v1731330211/capstone_directory/cics-logo.png"
            alt="ust-cics-logo"
          />
        </div>
        <p>UST-CICS</p>
        <small>Forgot Password</small>
      </div>
      <form class="col-10" @submit.prevent="forgotPassword">
        <InputText
          v-model="forgotForm.email"
          class="input-user-auth"
          placeholder="Email"
        />
        <Button label="SUBMIT" type="submit" :loading="isLoading" />
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from "@/api/auth";

export default {
  data() {
    return {
      forgotForm: {
        email: null,
      },
      isLoading: false,
    };
  },

  methods: {
    async forgotPassword() {
      this.isLoading = true;
      try {
        await auth.forgotpassword(this.forgotForm);
        this.$toast.add({
          severity: "success",
          summary: "A reset link was sent to your email.",
          life: 7000,
        });
        this.forgotForm.email = null;
      } catch (error) {
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong.",
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style></style>
