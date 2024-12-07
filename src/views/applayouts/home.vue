<template>
  <banner :title="'Capstone Directory'" />
  <dashboard v-if="shouldDisplayDashboard" :all="allCount" :best="bestCount" />
  <dataview
    :projects="projects"
    @refresh="
      fetchProjectsAdmin(
        this.$route.query.page ? parseInt(this.$route.query.page) : 0,
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
      )
    "
  />
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
      allCount: null,
      bestCount: null,
      currentPage: 0,
      role: null,
    };
  },

  computed: {
    shouldDisplayDashboard() {
      const query = this.$route.query;
      return (
        !Object.keys(query).length ||
        query.is_best_capstone === "true" ||
        query.page !== null
      );
    },
  },

  methods: {
    async fetchProjectCount() {
      if (this.role === "administrator") {
        const responseBest = await capstone.getAdmin(
          0,
          null,
          true,
          true,
          null,
          null,
          null
        );
        this.bestCount = responseBest.count;

        const repsonseAll = await capstone.getAdmin(
          0,
          null,
          null,
          true,
          null,
          null,
          null
        );
        this.allCount = repsonseAll.count;
      } else {
        const responseBest = await capstone.get(
          0,
          null,
          true,
          null,
          null,
          null
        );
        this.bestCount = responseBest.count;

        const repsonseAll = await capstone.get(0, null, null, null, null, null);

        this.allCount = repsonseAll.count;
      }
    },

    async fetchProjectsAdmin(
      page,
      search,
      is_best_capstone,
      is_approved,
      is_ip_registered,
      course,
      specialization,
      sort_by
    ) {
      try {
        const response = await capstone.getAdmin(
          page,
          search,
          is_best_capstone,
          is_approved,
          is_ip_registered,
          course,
          specialization,
          sort_by
        );
        this.totalCount = response.count;
        this.projects = response.results;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchProjects(
      page,
      search,
      is_best_capstone,
      is_ip_registered,
      specialization,
      sort_by
    ) {
      try {
        const response = await capstone.getAdmin(
          page,
          search,
          is_best_capstone,
          is_approved,
          is_ip_registered,
          course,
          specialization,
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

  mounted() {
    this.role = localStorage.getItem("role");
    this.fetchProjectCount();
  },

  watch: {
    "$route.query.page": {
      handler(newPage) {
        this.currentPage = newPage ? parseInt(newPage) : 0;
        if (this.role === "administrator") {
          this.fetchProjectsAdmin(
            newPage ? parseInt(newPage) : 0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.course ? this.$route.query.course : null,
            this.$route.query.specialization
              ? this.$route.query.specialization
              : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        } else {
          this.fetchProjects(
            newPage ? parseInt(newPage) : 0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            this.$route.query.specialization
              ? this.$route.query.specialization
              : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        }
      },
      immediate: true,
    },

    "$route.query.search": {
      handler(newSearch) {
        if (newSearch) {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
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
              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
              this.$route.query.sort_by ? this.$route.query.sort_by : null
            );
          } else {
            this.fetchProjects(
              0,
              newSearch ? newSearch : "",
              this.$route.query.is_best_capstone
                ? this.$route.query.is_best_capstone
                : null,
              this.$route.query.is_approved,
              this.$route.query.is_ip_registered
                ? this.$route.query.is_ip_registered
                : null,
              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
              this.$route.query.sort_by ? this.$route.query.sort_by : null
            );
          }
        }
      },
    },

    "$route.query.is_best_capstone": {
      handler(newValue) {
        if (newValue) {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
              0,
              null,
              newValue,
              this.$route.query.is_approved
                ? this.$route.query.is_approved
                : null,
              null,
              null,
              null,
              null
            );
          } else {
            this.fetchProjects(0, null, newValue, null, null, null, null);
          }
        }
      },
    },

    "$route.query.is_approved": {
      handler(newValue) {
        if (newValue) {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
              0,
              null,
              this.$route.query.is_best_capstone
                ? this.$route.query.is_best_capstone
                : null,
              newValue,
              this.$route.query.is_ip_registered
                ? this.$route.query.is_ip_registered
                : null,
              null,
              null,
              null
            );
          } else {
            this.fetchProjects(
              0,
              null,
              this.$route.query.is_best_capstone
                ? this.$route.query.is_best_capstone
                : null,
              newValue,
              this.$route.query.is_ip_registered
                ? this.$route.query.is_ip_registered
                : null,
              null,
              null
            );
          }
        }
      },
    },

    "$route.query.is_ip_registered": {
      handler(newValue) {
        if (newValue) {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
              0,
              null,
              null,
              this.$route.query.is_approved
                ? this.$route.query.is_approved
                : null,
              newValue ? newValue : "",
              null,
              null,
              null
            );
          } else {
            this.fetchProjects(
              0,
              null,
              null,
              this.$route.query.is_approved
                ? this.$route.query.is_approved
                : null,
              newValue,
              null,
              null
            );
          }
        }
      },
    },

    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchProjectsAdmin(
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
            null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        } else {
          this.fetchProjectsAdmin(
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
            newCourse,
            null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        }
      },
    },

    "$route.query.specialization": {
      handler(newSpec) {
        if (newSpec === null || newSpec === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
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
              null,
              this.$route.query.sort_by ? this.$route.query.sort_by : null
            );
          }
        } else {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
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
              newSpec,
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
              newSpec,
              this.$route.query.sort_by ? this.$route.query.sort_by : null
            );
          }
        }
      },
    },

    "$route.query.sort_by": {
      handler(newSort) {
        if (newSort === null || newSort === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
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
              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
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

              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
              null
            );
          }
        } else {
          if (this.role === "administrator") {
            this.fetchProjectsAdmin(
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
              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
              newSort
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

              this.$route.query.specialization
                ? this.$route.query.specialization
                : null,
              newSort
            );
          }
        }
      },
    },
  },
};
</script>

<style></style>
