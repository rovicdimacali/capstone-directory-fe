<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Change Password"
    :style="{ width: '350px' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <div
      class="wrap"
      style="align-items: center; justify-content: center; gap: 10px"
    >
      <p v-if="errors" style="color: red; margin: 0">{{ errors }}</p>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="current_password">Current Password</label>
        <Password
          v-model="changeForm.current_password"
          placeholder="Current Password"
          toggleMask
          :feedback="false"
        />
        <small v-if="validationErrors.current_password" style="color: red">{{
          validationErrors.current_password
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="new_password">New Password</label>
        <Password
          v-model="changeForm.new_password"
          placeholder="New Password"
          toggleMask
        />
        <small v-if="validationErrors.new_password" style="color: red">{{
          validationErrors.new_password
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="confirm_password">Confirm Password</label>
        <Password
          v-model="changeForm.confirm_password"
          placeholder="Confirm Password"
          toggleMask
          :feedback="false"
        />
        <small v-if="validationErrors.confirm_password" style="color: red">{{
          validationErrors.confirm_password
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Change"
        severity="contrast"
        @click="changePassword"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { auth } from "@/api/auth";
import * as Yup from "yup";

export default {
  props: ["isVisible"],
  data() {
    return {
      localVisible: true,
      changeForm: {
        current_password: null,
        new_password: null,
        confirm_password: null,
      },
      isLoading: false,
      validationErrors: [],
      errors: null,
      courses: ["IT", "CS", "IS"],
    };
  },

  validations: {
    changeForm: {
      current_password: { required: true, minLength: 1, maxLength: 255 },
      new_password: { required: true, maxLength: 255 },
      confirm_password: { required: true, maxLength: 255 },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            current_password: Yup.string().required(
              "Current Password is required"
            ),
            new_password: Yup.string()
              .required("New Password is required")
              .min(6, "New Password must be at least 6 characters"),
            confirm_password: Yup.string()
              .oneOf([Yup.ref("new_password"), null], "Passwords must match")
              .required("Confirm Password is required"),
          })
          .validate(this.changeForm, { abortEarly: false });

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

    async changePassword() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        try {
          await auth.changePassword(this.changeForm);
          this.$toast.add({
            severity: "success",
            summary: "Password Changed",
            detail: "Password changed successfully!",
            life: 3000,
          });
          this.$emit("close");
        } catch (error) {
          console.error(error);
          this.errors = error?.response?.data?.message;
        } finally {
          this.isLoading = false;
        }
      }
    },

    closeDialog() {
      this.$emit("close");
    },
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
