<template>
  <div class="dataview">
    <div class="search-filter-container wrap">
      <div class="search-input col-5">
        <InputText
          v-model="search"
          placeholder="Search"
          @keyup.enter="handleSearch"
        />
        <small>Press Enter to Search</small>
      </div>

      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Course"
        class="dropdown"
        @change="handleCourseChange"
        showClear
      />
      <Select
        v-if="role === 'administrator' || role === 'capstone coordinator'"
        v-model="selectedRole"
        :options="roles"
        placeholder="Select Role"
        class="dropdown"
        @change="handleRoleChange"
        showClear
      />
      <FileUpload
        mode="basic"
        name="demo[]"
        accept=".xlsx"
        :maxFileSize="1000000"
        customUpload
        @select="onUpload"
        :auto="true"
        chooseLabel="Upload Users"
      />
      <ProgressSpinner
        v-if="isUploading"
        style="width: 20px; height: 20px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div v-if="users?.length" class="data-container wrap">
      <usercard
        v-for="(user, index) in users"
        :key="index"
        :users="user"
        @refresh="this.$emit('refresh')"
      />
    </div>
    <div v-else class="data-container wrap">
      <p>No Data Available</p>
    </div>
  </div>
</template>

<script>
import usercard from "../card/usercard.vue";
import { users } from "@/api/users";

export default {
  props: ["users"],
  components: { usercard },
  data() {
    return {
      search: null,
      selectedCourse: null,
      selectedRole: null,
      courses: ["IT", "CS", "IS"],

      isUploading: false,
      roles: null,
      role: null,
    };
  },

  methods: {
    handleSearch() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    },

    handleCourseChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, course: this.selectedCourse } });
    },

    handleRoleChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, role: this.selectedRole } });
    },

    async onUpload(event) {
      this.isUploading = true;
      try {
        const file = event.files[0];
        await users.uploadUsers({ file });
        this.$toast.add({
          severity: "success",
          summary: "Success",
          detail: "Upload process started in background",
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message
            ? error.message
            : "CSV File Upload was unsuccessful",
          life: 3000,
        });
      } finally {
        this.isUploading = false;
      }
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");

    if (this.role === "capstone coordinator") {
      this.roles = ["student", "faculty"];
    } else if (this.role === "administrator") {
      this.roles = [
        "student",
        "faculty",
        "capstone coordinator",
        "administrator",
      ];
    }
  },

  watch: {
    "$route.query.search": {
      handler(newSearch) {
        if (newSearch === null || newSearch === undefined) {
          this.search = null;
        } else {
          this.search = newSearch;
        }
      },
      immediate: true,
    },
    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          this.selectedCourse = null;
        } else {
          this.selectedCourse = newCourse;
        }
      },
      immediate: true,
    },
    "$route.query.role": {
      handler(newRole) {
        if (newRole === null || newRole === undefined) {
          this.selectedRole = null;
        } else {
          this.selectedRole = newRole;
        }
      },
      immediate: true,
    },
  },
};
</script>
