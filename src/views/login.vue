<template>
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
        <small>Capstone Directory</small>
      </div>
      <div class="error-container row">
        <small v-if="error && Array.isArray(error)" style="color: red">
          <ul>
            <li v-for="(err, index) in error" :key="index">{{ err }}</li>
          </ul>
        </small>
        <small v-else-if="error" style="color: red">{{ error }}</small>
      </div>
      <form class="col-10" @submit.prevent="login">
        <InputText
          v-model="loginForm.email"
          class="input-user-auth"
          placeholder="Email"
        />
        <Password
          v-model="loginForm.password"
          class="input-user-auth"
          :feedback="false"
          toggleMask
          placeholder="Password"
        />
        <Button type="SUBMIT" label="LOGIN" :loading="isLoading" />
        <googlelogin
          @error="showError"
          @loading="isLoading = true"
          @stopLoading="isLoading = false"
        />
        <RouterLink to="/forgot-password"
          ><small>Forgot Password?</small></RouterLink
        >
        <RouterLink to="/register"><small>Register Here</small></RouterLink>
        <RouterLink to="/terms-of-use"><small>Terms of Use</small></RouterLink>
      </form>
    </div>
  </div>
</template>

<script>
import googlelogin from "@/components/login/googlelogin.vue";
import * as Yup from "yup";
import { auth } from "@/api/auth";

export default {
  components: { googlelogin },
  data() {
    return {
      loginForm: {
        email: null,
        password: null,
      },
      error: null,
      isLoading: false,
    };
  },

  validations: {
    loginForm: {
      email: { required: true },
      password: { required: true },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            email: Yup.string()
              .email("Invalid email format")
              .matches(
                /^[a-zA-Z0-9._%+-]+@ust\.edu\.ph$/,
                "Email must be a UST email"
              )
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })
          .validate(this.loginForm, { abortEarly: false });

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

    async login() {
      this.isLoading = true;

      if (await this.validateForm()) {
        try {
          const response = await auth.login(this.loginForm);
          if (response) {
            localStorage.setItem("token", response.access_token);

            const me = await auth.me();

            if (me) {
              localStorage.setItem("role", me?.role);
              localStorage.setItem("email", me?.email);
              localStorage.setItem("course", me?.course);
              localStorage.setItem("specialization", me?.specialization);
              localStorage.setItem("first_name", me?.first_name);
              localStorage.setItem("group", me?.group?.number);
              localStorage.setItem("academic_year", me?.group?.academic_year);

              this.$router.push("/capstone-directory?page=0&is_approved=true");
            }
          }
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

    showError(msg) {
      this.error = msg;
    },
  },
};
</script>

<style></style>
