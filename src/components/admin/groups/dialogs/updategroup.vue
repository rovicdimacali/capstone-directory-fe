<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Update Group"
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
        <label for="name">Group Name <span style="color: red">*</span></label>
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
        <label for="max_members"
          >No. of members <span style="color: red">*</span></label
        >
        <InputNumber
          v-model="groupForm.max_members"
          placeholder="Dela Cruz, Delos Santos, Ramos, Reyes"
        />
        <small v-if="validationErrors.max_members" style="color: red">{{
          validationErrors.max_members
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="academic_year"
          >Academic Year <span style="color: red">*</span></label
        >
        <Select
          v-model="groupForm.academic_year"
          :options="academic_years"
          placeholder="Academic Year"
        />
        <small v-if="validationErrors.academic_year" style="color: red">{{
          validationErrors.academic_year
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="course">Program <span style="color: red">*</span></label>
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
        <label for="specialization"
          >Specialization <span style="color: red">*</span></label
        >
        <Select
          v-model="groupForm.specialization"
          :options="specializations[groupForm.course]"
          placeholder="Select a Specialization"
        />
        <small v-if="validationErrors.specialization" style="color: red">{{
          validationErrors.specialization
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Update"
        severity="contrast"
        @click="updateGroup"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { groups } from "@/api/groups";
import * as Yup from "yup";

export default {
  props: ["isVisible", "group"],
  data() {
    return {
      localVisible: true,
      groupForm: null,
      academic_years: null,
      isLoading: false,
      validationErrors: {},
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
    groupForm: {
      name: { required: true, minLength: 1, maxLength: 255 },
      max_members: { required: true, minLength: 1, maxLength: 255 },
      academic_year: { required: false, maxLength: 255 },
      course: { required: true, maxLength: 255 },
      specialization: { required: true, maxLength: 255 },
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
            name: Yup.string().required("Group Name is required"),
            max_members: Yup.number()
              .typeError("Max Members must be a number")
              .required("Max Members is required")
              .min(1, "Max Members must be greater than 0")
              .max(255, "Max Members must be less than or equal to 255"),
            academic_year: Yup.string()
              .required("Academic Year is required")
              .matches(
                /^\d{4}-\d{4}$/,
                "Academic Year must be in the format YYYY-YYYY (No Spaces)"
              ),
            course: Yup.string().required("Course is required"),
            specialization: Yup.string().required("Specialization is required"),
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

    async updateGroup() {
      await this.validateForm();
      console.log("ppumasok", Object.keys(this.validationErrors));
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        this.groupForm.name = `${this.groupForm.name} (${this.groupForm.academic_year})`;
        try {
          await groups.updateGroup(this.group?.id, this.groupForm);
          this.$toast.add({
            severity: "success",
            summary: "Group Updated",
            detail: "Group updated successfully!",
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
      }
    },

    closeDialog() {
      this.$emit("close");
    },
  },

  mounted() {
    this.generateAcademicYears();
    this.groupForm = this.group;
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
