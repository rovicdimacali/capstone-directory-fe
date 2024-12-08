<template>
  <Toast />
  <div class="user-auth">
    <div class="user-auth-box col">
      <div class="header">
        <div class="logo">
          <img
            src="https://res.cloudinary.com/drayixmpk/image/upload/v1733590588/cics-logo_mi9jey.png"
            alt="ust-cics-logo"
          />
        </div>
        <p>UST-CICS</p>
        <small>Registration</small>
      </div>
      <div class="error-container row">
        <small v-if="error && Array.isArray(error)" style="color: red">
          <ul>
            <li v-for="(err, index) in error" :key="index">{{ err }}</li>
          </ul>
        </small>
        <small v-else-if="error" style="color: red">{{ error }}</small>
      </div>
      <form class="col-10" @submit.prevent="register">
        <InputText
          v-model="registrationForm.first_name"
          class="input-user-auth"
          placeholder="First Name"
        />
        <InputText
          v-model="registrationForm.last_name"
          class="input-user-auth"
          placeholder="Last Name"
        />
        <InputText
          v-model="registrationForm.student_number"
          class="input-user-auth"
          placeholder="Student Number"
        />
        <InputText
          v-model="registrationForm.email"
          class="input-user-auth"
          placeholder="Email"
        />
        <Select
          v-model="registrationForm.course"
          :options="courses"
          placeholder="Select a Program"
        />
        <Select
          v-model="registrationForm.specialization"
          :options="specializations[registrationForm.course]"
          placeholder="Select a Specialization"
        />
        <Password
          v-model="registrationForm.password"
          class="input-user-auth"
          :feedback="true"
          toggleMask
          placeholder="Password"
        />
        <Password
          v-model="registrationForm.confirm_password"
          class="input-user-auth"
          :feedback="false"
          toggleMask
          placeholder="Confirm Password"
        />
        <Button type="SUBMIT" label="REGISTER" :loading="isLoading" />
      </form>
    </div>
  </div>
</template>

<script>
import * as Yup from "yup";
import { auth } from "@/api/auth";

export default {
  data() {
    return {
      registrationForm: {
        first_name: null,
        last_name: null,
        student_number: null,
        email: null,
        course: null,
        specialization: null,
        password: null,
        confirm_password: null,
      },
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
      error: null,
      isLoading: false,
    };
  },

  validations: {
    registrationForm: {
      first_name: { required: true },
      last_name: { required: true },
      student_number: { required: true },
      email: { required: true },
      course: { required: true },
      specialization: { required: true },
      email: { required: true },
      password: { required: true },
      confirm_password: { required: true },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            first_name: Yup.string().required("First Name is required"),
            last_name: Yup.string().required("Last Name is required"),
            student_number: Yup.string().required("Student Number is required"),

            email: Yup.string()
              .email("Invalid email format")
              .matches(
                /^[a-zA-Z0-9._%+-]+@ust\.edu\.ph$/,
                "Email must be a UST email"
              )
              .required("Email is required"),
            course: Yup.string().required("Program is required"),
            specialization: Yup.string().required("Specialization is required"),
            password: Yup.string().required("Password is required"),
            confirm_password: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Confirm Password is required"),
          })
          .validate(this.registrationForm, { abortEarly: false });

        this.errors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        if (error.inner) {
          // Only attempt to process error.inner if it exists
          this.error = error.inner.map((err) => err.errors).flat();
        } else {
          // Handle unexpected validation errors
          console.error("Validation error:", error);
        }
        return false; // Form is invalid
      }
    },

    async register() {
      this.isLoading = true;

      if (await this.validateForm()) {
        try {
          await auth.register(this.registrationForm);
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
      }
      this.isLoading = false;
    },
  },
};
</script>

<style></style>
