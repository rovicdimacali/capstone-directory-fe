<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Create User"
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
        <label for="first_name"
          >First Name <span style="color: red">*</span></label
        >
        <InputText v-model="userForm.first_name" />
        <small v-if="validationErrors.first_name" style="color: red">{{
          validationErrors.first_name
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="middle_name">Middle Name (Optional)</label>
        <InputText v-model="userForm.middle_name" />
        <small v-if="validationErrors.middle_name" style="color: red">{{
          validationErrors.middle_name
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="last_name"
          >Last Name <span style="color: red">*</span></label
        >
        <InputText v-model="userForm.last_name" />
        <small v-if="validationErrors.last_name" style="color: red">{{
          validationErrors.last_name
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="role">Role <span style="color: red">*</span></label>
        <Select
          v-model="userForm.role"
          :options="roles"
          placeholder="Select a Role"
        />
        <small v-if="validationErrors.role" style="color: red">{{
          validationErrors.role
        }}</small>
      </div>
      <div
        v-if="userForm.role === 'student'"
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="student_number">Student Number</label>
        <InputText v-model="userForm.student_number" />
        <small v-if="validationErrors.student_number" style="color: red">{{
          validationErrors.student_number
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="email">Email <span style="color: red">*</span></label>
        <InputText v-model="userForm.email" />
        <small v-if="validationErrors.email" style="color: red">{{
          validationErrors.email
        }}</small>
      </div>

      <div
        v-if="userForm.role !== 'administrator'"
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="course">Program </label>
        <Select
          v-model="userForm.course"
          :options="courses"
          placeholder="Select a Program"
        />
        <small v-if="validationErrors.course" style="color: red">{{
          validationErrors.course
        }}</small>
      </div>
      <div
        v-if="userForm.role === 'student'"
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="specialization">Specialization </label>
        <Select
          v-model="userForm.specialization"
          :options="specializations[userForm.course]"
          placeholder="Select a Specialization"
        />
        <small v-if="validationErrors.specialization" style="color: red">{{
          validationErrors.specialization
        }}</small>
      </div>
      <div
        class="input-container col-5"
        style="flex-grow: 1; flex-basis: 350px"
      >
        <label for="is_active">Active?</label>
        <Checkbox v-model="userForm.is_active" binary />
        <small v-if="validationErrors.is_active" style="color: red">{{
          validationErrors.is_active
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Create"
        severity="contrast"
        @click="updateUser"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { users } from "@/api/users";
import * as Yup from "yup";

export default {
  props: ["isVisible"],
  data() {
    return {
      localVisible: true,
      userForm: {
        first_name: null,
        middle_name: null,
        last_name: null,
        student_number: null,
        email: null,
        role: null,
        course: null,
        specialization: null,
        is_active: true,
      },
      specializations: {
        IT: [
          "Automation",
          "Network and Security",
          "Web and Mobile App Development",
        ],
        IS: ["Business Analytics", "Service Management"],
        CS: ["Core Computer Science", "Game Development", "Data Science"],
      },
      isLoading: false,
      validationErrors: {},
      roles: ["student", "faculty", "capstone coordinator", "administrator"],
      courses: ["IT", "CS", "IS"],
    };
  },

  validations: {
    userForm: {
      first_name: { required: true, minLength: 1, maxLength: 255 },
      middle_name: { required: false, maxLength: 255 },
      last_name: { required: true, minLength: 1, maxLength: 255 },
      student_number: { required: false, maxLength: 255 },
      email: { required: true, type: "email", minLength: 1, maxLength: 254 },
      role: { required: true, minLength: 1, maxLength: 200 },
      course: { required: false, maxLength: 255 },
      specialization: { required: false, maxLength: 255 },
      is_active: { required: true, type: "boolean" },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            first_name: Yup.string().required("First name is required"),
            middle_name: Yup.string().nullable(),
            last_name: Yup.string().required("Last name is required"),
            student_number: Yup.string().nullable(),
            email: Yup.string()
              .email("Invalid email format")
              .matches(
                /^[a-zA-Z0-9._%+-]+@ust\.edu\.ph$/,
                "Email must be a UST email"
              )
              .required("Email is required"),
            role: Yup.string().required("Role is required"),
            course: Yup.string().nullable(),
            specialization: Yup.string().nullable(),
            is_active: Yup.boolean().required("Active status is required"),
          })
          .validate(this.userForm, { abortEarly: false });

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

    async updateUser() {
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.isLoading = true;
        try {
          await users.createUser(this.userForm);
          this.$toast.add({
            severity: "success",
            summary: "User Created",
            detail: "User created successfully!",
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
