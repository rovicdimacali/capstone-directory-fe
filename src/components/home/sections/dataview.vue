<template>
  <div class="dataview">
    <div class="search-filter-container wrap">
      <div class="search-input col-5">
        <InputText
          v-model="search"
          placeholder="Search by title, keywords, date (YYYY-MM-DD), or academic year"
          @input="handleSearch"
        />
      </div>
      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Program"
        class="dropdown"
        @change="handleCourseChange"
        showClear
        style="max-width: 200px"
      />
      <Select
        v-model="selectedSpec"
        :options="specializations[selectedCourse]"
        placeholder="Specialization"
        class="dropdown"
        @change="handleSpecializationChange"
        showClear
        style="max-width: 200px"
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
        style="max-width: 180px"
      />
    </div>
    <div v-if="projects?.length" class="data-container wrap">
      <datacard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @refresh="this.$emit('refresh')"
        @bestProject="this.$emit('bestProject')"
      />
    </div>
    <p v-else>No Capstone Projects Fetched.</p>
  </div>
</template>

<script>
import datacard from "../card/datacard.vue";
import debounce from "lodash/debounce";

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
    };
  },
  methods: {
    handleSearch: debounce(function () {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    }, 300),

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
        } else {
          // Create a copy of the query object
          const newQuery = { ...this.$route.query };
          // Remove the `course` and `specialization` keys
          delete newQuery.course;
          delete newQuery.specialization;
          // Update the route
          this.$router.push({ query: newQuery });
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
