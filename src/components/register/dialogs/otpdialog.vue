<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="OTP Verification"
    :style="{ width: '350px' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
    :closable="false"
  >
    <div class="input-container col-5" style="flex-grow: 1; flex-basis: 350px">
      <label for="name">OTP <span style="color: red">*</span></label>
      <InputText
        v-model="registrationForm.register_otp"
        placeholder="Enter OTP Here"
      />
      <small v-if="validationErrors.name" style="color: red">{{
        validationErrors.name
      }}</small>
      <Button
        severity="secondary"
        icon="pi pi-refresh"
        :label="resendButtonLabel"
        :disabled="isResendDisabled"
        @click="resendOTP"
      />
    </div>

    <template #footer>
      <Button
        label="Submit"
        severity="contrast"
        @click="register"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { auth } from "@/api/auth";
import * as Yup from "yup";

export default {
  props: ["isVisible", "registrationForm"],
  data() {
    return {
      localVisible: true,
      registerForm: null,
      academic_years: null,
      isLoading: false,
      validationErrors: [],
      resendButtonLabel: "Resend in 30 seconds",
      isResendDisabled: true,
      resendTimer: 30,
      resendInterval: null,
    };
  },

  validations: {
    registerForm: {
      register_otp: { required: true, minLength: 1, maxLength: 255 },
    },
  },

  methods: {
    generateAcademicYears() {
      const currentYear = new Date().getFullYear();
      const academicYears = [];

      for (let year = 2014; year < currentYear; year++) {
        academicYears.push(`${year}-${year + 1}`);
      }

      this.academic_years = academicYears;
    },

    async validateForm() {
      try {
        await Yup.object()
          .shape({
            register_otp: Yup.string().required("OTP is required"),
          })
          .validate(this.registerForm, { abortEarly: false });

        this.validationErrors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        this.validationErrors = {};
        error.inner.forEach((err) => {
          this.validationErrors[err.path] = err.message;
        });

        return false; // Form is invalid
      }
    },

    async register() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        try {
          await auth.register(this.registerForm);
          this.$toast.add({
            severity: "success",
            summary: "Registered Successfully.",
            detail: "Redirecting to login",
            life: 3000,
          });

          // Wait for 3 seconds before redirecting
          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        } catch (error) {
          this.error = error.response?.data?.message
            ? error.response?.data?.message
            : error.response?.data;
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    },

    async resendOTP() {
      try {
        await auth.otp({ email: this.registrationForm.email });
        this.$toast.add({
          severity: "success",
          summary: "OTP was sent to your email",
          life: 3000,
        });
      } catch (error) {
        this.error = error.response?.data?.message
          ? error.response?.data?.message
          : error.response?.data;
      } finally {
        this.isLoading = false;
      }

      this.$toast.add({
        severity: "info",
        summary: "OTP Resent",
        detail: "Please check your email",
        life: 3000,
      });

      this.startResendTimer(); // Restart the timer after resending OTP
    },

    startResendTimer() {
      this.resendTimer = 30;
      this.isResendDisabled = true;
      this.resendButtonLabel = `Resend in ${this.resendTimer} seconds`;

      this.resendInterval = setInterval(() => {
        this.resendTimer -= 1;
        if (this.resendTimer > 0) {
          this.resendButtonLabel = `Resend in ${this.resendTimer} seconds`;
        } else {
          this.resendButtonLabel = "Resend OTP";
          this.isResendDisabled = false;
          clearInterval(this.resendInterval);
        }
      }, 1000);
    },

    closeDialog() {
      this.$emit("close");
    },
  },

  mounted() {
    this.registerForm = this.registrationForm;
    this.startResendTimer();
  },

  watch: {
    isVisible(newVal) {
      this.localVisible = newVal;
    },
    localVisible(newVal) {
      this.$emit("update:isVisible", newVal);
    },
  },
};
</script>

<style></style>
