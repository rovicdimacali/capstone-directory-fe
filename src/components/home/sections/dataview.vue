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
        v-if="role === 'administrator'"
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Program"
        class="dropdown"
        @change="handleCourseChange"
        showClear
      />
      <Select
        v-if="role !== 'student'"
        v-model="selectedSpec"
        :options="specializations[selectedCourse]"
        placeholder="Select Specialization"
        class="dropdown"
        @change="handleSpecializationChange"
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
      selectedSpec: null,
      selectedCourse: null,
      selectedSort: null,
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

    handleSpecializationChange() {
      const query = this.$route.query;
      this.$router.push({
        query: { ...query, specialization: this.selectedSpec },
      });
    },

    handleSortChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, sort_by: this.selectedSort } });
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
  },

  watch: {
    "$route.query.search": {
      handler(newSearch) {
        if (newSearch) {
          this.search = newSearch;
        }
      },
      immediate: true,
    },
    "$route.query.course": {
      handler(newCourse) {
        if (newCourse) {
          this.selectedCourse = newCourse;
        }
      },
      immediate: true,
    },

    "$route.query.specialization": {
      handler(newSpec) {
        if (newSpec) {
          this.selectedSpec = newSpec;
        }
      },
      immediate: true,
    },
    "$route.query.sort_by": {
      handler(newSort) {
        if (newSort) {
          this.selectedSort = newSort;
        }
      },
      immediate: true,
    },
  },
};
</script>
