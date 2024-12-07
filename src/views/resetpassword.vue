<template>
  <div class="user-auth">
    <Toast />
    <div class="user-auth-box col">
      <div class="header">
        <div class="logo">
          <img
            src="https://res.cloudinary.com/drayixmpk/image/upload/v1733590588/cics-logo_mi9jey.png"
            alt="ust-cics-logo"
          />
        </div>
        <p>UST-CICS</p>
        <small>Reset Password</small>
      </div>
      <form class="col-10" @submit.prevent="resetPassword">
        <Password
          v-model="resetForm.new_password"
          class="input-user-auth"
          :feedback="true"
          toggleMask
          placeholder="Password"
        />
        <Password
          v-model="resetForm.confirm_password"
          class="input-user-auth"
          :feedback="false"
          toggleMask
          placeholder="Confirm Password"
        />
        <Button label="RESET" type="submit" :loading="isLoading" />
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from "@/api/auth";
import { Toast } from "primevue";

export default {
  data() {
    return {
      resetForm: {
        token: null,
        new_password: null,
        confirm_password: null,
      },
      isLoading: false,
    };
  },

  validations: {
    resetForm: {
      new_password: { required: true, maxLength: 255 },
      confirm_password: { required: false, maxLength: 255 },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            new_password: Yup.string()
              .required("Password is required")
              .min(8, "Password must be at least 8 characters long"), // Example for additional validation
            confirm_password: Yup.string()
              .required("Confirm Password is required")
              .oneOf([Yup.ref("new_password"), null], "Passwords must match"),
          })
          .validate(this.resetForm, { abortEarly: false });

        this.validationErrors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        this.validationErrors = {};
        error?.inner?.forEach((err) => {
          this.validationErrors[err.path] = err.message;
        });

        return false; // Form is invalid
      }
    },

    async resetPassword() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        try {
          await auth.resetPassword(this.resetForm);
          this.$toast.add({
            severity: "success",
            summary: "Success",
            detail: "Password reset successfully!",
            life: 3000,
          });
          this.$router.push("/login");
        } catch (error) {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "Uh-oh!",
            detail: "Something went wrong.",
            life: 3000,
          });
        } finally {
          this.isLoading = false;
        }
      }
    },
  },

  mounted() {
    this.resetForm.token = this.$route.query.token;
  },
};
</script>

<style></style>
