<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Create Group"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
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
        <label for="name">Group Name</label>
        <InputText
          v-model="groupForm.name"
          placeholder="Dela Cruz, Delos Santos, Ramos, Reyes"
        />
        <small v-if="validationErrors.name" style="color: red">{{
          validationErrors.name
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="academic_year">Academic Year</label>
        <InputText
          v-model="groupForm.academic_year"
          placeholder="ex. 2023-2024"
        />
        <small v-if="validationErrors.academic_year" style="color: red">{{
          validationErrors.academic_year
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="course">Program</label>
        <Select
          v-model="groupForm.course"
          :options="courses"
          placeholder="Select a Program"
        />
        <small v-if="validationErrors.course" style="color: red">{{
          validationErrors.course
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="specialization">Specialization</label>
        <InputText v-model="groupForm.specialization" />
        <small v-if="validationErrors.specialization" style="color: red">{{
          validationErrors.specialization
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Create"
        severity="contrast"
        @click="createGroup"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { groups } from "@/api/groups";
import * as Yup from "yup";

export default {
  props: ["isVisible"],
  data() {
    return {
      localVisible: true,
      groupForm: {
        name: null,
        academic_year: null,
        course: null,
        specialization: null,
      },
      isLoading: false,
      validationErrors: [],
      courses: ["IT", "CS", "IS"],
    };
  },

  validations: {
    groupForm: {
      name: { required: true, minLength: 1, maxLength: 255 },
      academic_year: { required: false, maxLength: 255 },
      course: { required: true, maxLength: 255 },
      specialization: { required: false, maxLength: 255 },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            name: Yup.string().required("Group Name is required"),
            academic_year: Yup.string()
              .required("Academic Year is required")
              .matches(
                /^\d{4}-\d{4}$/,
                "Academic Year must be in the format YYYY-YYYY (No Spaces)"
              ),
            course: Yup.string().required("Course is required"),
            specialization: Yup.string().nullable(),
          })
          .validate(this.groupForm, { abortEarly: false });

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

    async createGroup() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        this.groupForm.name = `${this.groupForm.name} (${this.groupForm.academic_year})`;
        try {
          await groups.createGroup(this.groupForm);
          this.$toast.add({
            severity: "success",
            summary: "Group Created",
            detail: "Group created successfully!",
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
