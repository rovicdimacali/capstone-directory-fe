<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Reject Capstone/Thesis"
    :style="{ width: '350px' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <div class="input-container col-5" style="flex-grow: 1; flex-basis: 350px">
      <label for="name">Reject Reason <span style="color: red">*</span></label>
      <Textarea
        v-model="rejectForm.reject_reason"
        placeholder="Enter Reject Reason Here"
        rows="5"
        cols="30"
      />
      <small v-if="validationErrors.reject_reason" style="color: red">{{
        validationErrors.reject_reason
      }}</small>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="closeDialog" />
      <Button
        label="Submit"
        severity="contrast"
        @click="rejectProject"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { auth } from "@/api/auth";
import * as Yup from "yup";

export default {
  props: ["isVisible", "projectID"],
  data() {
    return {
      localVisible: true,
      rejectForm: {
        project_id: this.projectID,
        is_approved: false,
        reject_reason: null,
      },
      isLoading: false,
      validationErrors: [],
    };
  },

  validations: {
    rejectForm: {
      reject_reason: { required: true, minLength: 1, maxLength: 255 },
    },
  },

  methods: {
    async validateForm() {
      this.isLoading = true;
      try {
        await Yup.object()
          .shape({
            reject_reason: Yup.string().required("Reject Reason is required"),
          })
          .validate(this.rejectForm, { abortEarly: false });

        this.validationErrors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        this.validationErrors = {};
        error.inner.forEach((err) => {
          this.validationErrors[err.path] = err.message;
        });
      } finally {
        this.isLoading = false;
      }
    },

    async rejectProject() {
      try {
        await capstone.reject(this.rejectForm);
        this.$toast.add({
          severity: "success",
          summary: "Success",
          detail: "Project Rejected Successfully.",
          life: 3000,
        });
        this.$emit("refresh");
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Project was not rejected successfully.",
          life: 3000,
        });
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
