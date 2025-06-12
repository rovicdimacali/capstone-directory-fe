<template>
  <div class="dataview">
    <creategroup
      v-if="createVisible"
      :isVisible="createVisible"
      :group="group"
      @close="createVisible = false"
      @submit="
        () => {
          createVisible = false;
          this.$emit('refresh');
        }
      "
    />
    <changemaxmembers
      v-if="changeVisible"
      :isVisible="changeVisible"
      :group="group"
      @close="changeVisible = false"
      @submit="
        changeVisible = false;
        getMaxMembers();
      "
      :max="max_group_members"
    />
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
        v-model="selectedAcademicYear"
        :options="academic_years"
        placeholder="Academic Year"
        class="dropdown"
        @change="handleAYChange"
        showClear
        style="max-width: 200px"
      />
      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Program"
        class="dropdown"
        @change="handleCourseChange"
        showClear
      />
      <Button label="Create Group" @click="createVisible = true" />
      <!-- <Button
        v-if="
          this.role === 'capstone coordinator' && this.role === 'administrator'
        "
        icon="pi pi-cog"
        @click="changeVisible = true"
        :disabled="max_group_members === null"
      /> -->
    </div>
    <div v-if="groups?.length" class="data-container wrap">
      <groupcard
        v-for="(group, index) in groups"
        :key="index"
        :group="group"
        @refresh="this.$emit('refresh')"
      />
    </div>
    <div v-else class="data-container wrap">
      <p>No Data Available</p>
    </div>
  </div>
</template>

<script>
import groupcard from "../card/groupcard.vue";
import creategroup from "../dialogs/creategroup.vue";
import changemaxmembers from "../dialogs/changemaxmembers.vue";
import { groups } from "@/api/groups";

export default {
  props: ["groups"],
  components: { groupcard, creategroup, changemaxmembers },
  data() {
    return {
      search: null,
      selectedCourse: null,
      courses: ["IT", "CS", "IS"],
      createVisible: false,
      changeVisible: false,
      role: null,
      academic_years: null,
      selectedAcademicYear: null,
      max_group_members: null,
    };
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

    handleSearch() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    },

    handleAYChange() {
      const query = this.$route.query;
      this.$router.push({
        query: { ...query, academic_year: this.selectedAcademicYear },
      });
    },

    handleCourseChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, course: this.selectedCourse } });
    },

    async getMaxMembers() {
      try {
        const response = await groups.getMaxMembers();
        this.max_group_members = response.max_group_members;
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
    this.getMaxMembers();
    this.generateAcademicYears();
    if (this.role === "capstone coordinator") {
      this.selectedCourse = localStorage.getItem("course");

      if (this.selectedCourse) {
        this.handleCourseChange();
      }
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

    "$route.query.academic_year": {
      handler(newAY) {
        if (newAY) {
          this.selectedAcademicYear = newAY;
        } else {
          // Create a copy of the query object
          const newQuery = { ...this.$route.query };
          // Remove the `course` and `specialization` keys
          delete newQuery.academic_year;
          // Update the route
          this.$router.push({ query: newQuery });
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
  },
};
</script>
