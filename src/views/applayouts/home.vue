<template>
  <banner :title="'Capstone Directory'" />
  <dashboard v-if="shouldDisplayDashboard" :all="allCount" :best="bestCount" />
  <dataview
    :projects="projects"
    @refresh="
      fetchProjects(
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
        this.$route.query.specialization
          ? this.$route.query.specialization
          : null,
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
      const responseBest = await capstone.get(0, null, true, null, null, null);
      this.bestCount = responseBest.count;

      const repsonseAll = await capstone.get(0, null, null, true, null, null);
      this.allCount = repsonseAll.count;
    },

    async fetchProjects(
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
        const response = await capstone.get(
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
    "$route.query": {
      handler() {
        this.currentPage = this.$route.query.page
          ? parseInt(this.$route.query.page)
          : 0;
        if (this.role === "administrator") {
          this.fetchProjects(
            this.$route.query.page ? parseInt(this.$route.query.page) : 0,
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
            this.$route.query.page ? parseInt(this.$route.query.page) : 0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.is_best_capstone
              ? this.$route.query.is_best_capstone
              : null,
            this.$route.query.is_approved,
            this.$route.query.is_ip_registered
              ? this.$route.query.is_ip_registered
              : null,
            null,
            this.$route.query.specialization
              ? this.$route.query.specialization
              : null,
            this.$route.query.sort_by ? this.$route.query.sort_by : null
          );
        }
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
