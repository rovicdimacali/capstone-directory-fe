<template>
  <banner :title="'Capstone Directory'" />
  <dashboard />
  <dataview :projects="projects" />
  <Paginator
    :rows="10"
    :totalRecords="totalCount"
    :first="currentPage * 10"
    @page="changePage"
  ></Paginator>
</template>

<script>
import banner from "@/layouts/banner.vue";
import dashboard from "@/components/home/sections/dashboard.vue";
import Dataview from "@/components/home/sections/dataview.vue";
import { capstone } from "@/api/capstone";
export default {
  components: { banner, dashboard, Dataview },
  data() {
    return {
      projects: null,
      totalCount: null,
      currentPage: 0,
    };
  },
  methods: {
    async fetchProjects(
      page,
      search,
      is_best_capstone,
      is_approved,
      is_ip_registered,
      course,
      sort_by
    ) {
      try {
        const response = await capstone.get(
          page,
          search,
          is_best_capstone,
          is_approved,
          is_ip_registered,
          course,
          sort_by
        );
        this.totalCount = response.count;
        this.projects = response.results;
      } catch (error) {
        console.error(error);
      }
    },

    changePage(event) {
      let page = event.page;
      this.$router.push({ path: this.$route.path, query: { page } });
    },
  },

  watch: {
    "$route.query.page": {
      handler(newPage) {
        this.currentPage = newPage ? parseInt(newPage) : 0;
        this.fetchProjects(
          newPage ? parseInt(newPage) : 0,
          this.$route.query.search ? this.$route.query.search : null,
          this.$route.query.is_best_capstone
            ? this.$route.query.is_best_capstone
            : null,
          this.$route.query.is_approved ? this.$route.query.is_approved : null,
          this.$route.query.is_ip_registered
            ? this.$route.query.is_ip_registered
            : null,
          this.$route.query.course ? this.$route.query.course : null,
          this.$route.query.sort_by ? this.$route.query.sort_by : null
        );
      },
      immediate: true, // Call the handler immediately on component mount
    },

    "$route.query.search": {
      handler(newSearch) {
        if (newSearch === null || newSearch === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchProjects(
            0,
            null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.course ? this.$route.query.course : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        } else {
          this.fetchProjects(
            0,
            newSearch ? newSearch : "",
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.course ? this.$route.query.course : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        }
      },
    },

    "$route.query.is_best_capstone": {
      handler(newValue) {
        if (newValue === null || newValue === undefined) {
          const { query, ...route } = this.$route;
          this.$router.push({ ...route, query: {} }); // Set query to an empty object
          this.fetchProjects(0, null, null, null, null, null, null);
        } else {
          this.fetchProjects(
            0,
            null,
            newValue ? newValue : "",
            null,
            null,
            null,
            null
          );
        }
      },
    },

    "$route.query.is_approved": {
      handler(newValue) {
        if (newValue) {
          this.fetchProjects(
            0,
            null,
            null,
            newValue ? newValue : "",
            null,
            null,
            null
          );
        }
      },
    },

    "$route.query.is_ip_registered": {
      handler(newValue) {
        if (newValue) {
          this.fetchProjects(
            0,
            null,
            null,
            null,
            newValue ? newValue : "",
            null,
            null
          );
        }
      },
    },

    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchProjects(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        } else {
          this.fetchProjects(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            newCourse ? newCourse : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        }
      },
    },

    "$route.query.sort_by": {
      handler(newSort) {
        if (newSort === null || newSort === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchProjects(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.course ? this.$route.query.course : null,
            null
          );
        } else {
          this.fetchProjects(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved
              ? this.$route.query.is_approved
              : null,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.course ? this.$route.query.course : null,
            newSort ? newSort : null
          );
        }
      },
    },
  },
};
</script>

<style></style>
