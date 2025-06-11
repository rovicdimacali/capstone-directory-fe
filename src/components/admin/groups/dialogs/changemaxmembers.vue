<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Change Max Members"
    :style="{ width: '340px' }"
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
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="name">Max Members <span style="color: red">*</span></label>
        <InputNumber v-model="changeForm.max_group_members" />
        <small v-if="validationErrors.max_group_members" style="color: red">{{
          validationErrors.max_group_members
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Change"
        severity="contrast"
        @click="changeMaxMembers"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { groups } from "@/api/groups";
import * as Yup from "yup";

export default {
  props: ["isVisible", "max"],
  data() {
    return {
      localVisible: true,
      changeForm: {
        max_group_members: null,
      },
      academic_years: null,
      isLoading: false,
      validationErrors: [],
      courses: ["IT", "CS", "IS"],
      specializations: {
        IT: [
          "Automation",
          "Network and Security",
          "Web and Mobile App Development",
        ],
        IS: ["Business Analytics", "Service Management"],
        CS: ["Core Computer Science", "Game Development", "Data Science"],
      },
    };
  },

  validations: {
    changeForm: {
      max_group_members: { required: true, minLength: 1, maxLength: 255 },
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
            max_group_members: Yup.number()
              .typeError("Max Members must be a number")
              .required("Max Members is required")
              .min(1, "Max Members must be greater than 0")
              .max(255, "Max Members must be less than or equal to 255"),
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

    async changeMaxMembers() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        try {
          await groups.updateMaxMembers(this.changeForm);
          this.$toast.add({
            severity: "success",
            summary: "Max Members Updated",
            detail: "Max members updated successfully!",
            life: 3000,
          });
          this.$emit("submit");
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
      } else {
        this.isLoading = false;
      }
    },

    closeDialog() {
      this.$emit("close");
    },
  },

  mounted() {
    this.changeForm.max_group_members = this.max;
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
