<template>
  <Toast />
  <div class="dataview">
    <div class="search-filter-container wrap">
      <InputText
        v-model="search"
        class="search-input"
        placeholder="Search"
        @keyup.enter="handleSearch"
      />
      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Course"
        class="dropdown"
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
      <usercard v-for="(user, index) in users" :key="index" :users="user" />
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
      selectedSort: null,
      selectedDate: null,
      courses: [
        "Computer Science",
        "Information Technology",
        "Information System",
      ],
      isUploading: false,
    };
  },

  methods: {
    handleSearch() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    },

    async onUpload(event) {
      this.isUploading = true;
      try {
        const file = event.files[0];
        await users.uploadUsers({ file });
        this.$toast.add({
          severity: "success",
          summary: "Success",
          detail: "CSV File Uploaded",
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
  },
};
</script>
