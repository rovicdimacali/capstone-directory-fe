<template>
  <div class="dataview">
    <div class="search-filter-container wrap">
      <InputText
        v-model="search"
        class="search-input"
        placeholder="Search by title, keyword, academic year, or group"
        @keypress.enter="handleSearch"
      />
      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Course"
        class="dropdown"
        @change="handleCourseChange"
        showClear
      />
      <Select
        v-model="selectedSort"
        :options="sorting"
        optionLabel="label"
        optionValue="value"
        placeholder="Sorting"
        class="dropdown"
        @change="handleSortChange"
        showClear
      />
    </div>
    <div v-if="projects?.length" class="data-container wrap">
      <datacard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @refresh="this.$emit('refresh')"
      />
    </div>
    <p v-else>No Capstone Projects Fetched.</p>
  </div>
</template>

<script>
import datacard from "../card/datacard.vue";

export default {
  props: ["projects"],
  components: { datacard },
  data() {
    return {
      selectedCourse: null,
      selectedSort: null,
      courses: ["CS", "IT", "IS"],
      sorting: [
        {
          label: "Newest",
          value: "newest",
        },
        {
          label: "Oldest",
          value: "oldest",
        },
        {
          label: "Alphabetical (A-Z)",
          value: "alphabetical_asc",
        },
        {
          label: "Alphabetical (Z-A)",
          value: "alphabetical_desc",
        },
      ],
      search: null,
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

    handleSortChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, sort_by: this.selectedSort } });
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
    "$route.query.sort_by": {
      handler(newSort) {
        if (newSort === null || newSort === undefined) {
          this.selectedSort = null;
        } else {
          this.selectedSort = newSort;
        }
      },
      immediate: true,
    },
  },
};
</script>
