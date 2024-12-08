<template>
  <banner :title="'Activity Logs'" />
  <logsview :logs="logs" />
  <Paginator
    :rows="10"
    :totalRecords="totalCount"
    :first="currentPage * 10"
    @page="changePage"
  ></Paginator>
</template>

<script>
import banner from "@/layouts/banner.vue";
import logsview from "@/components/admin/activitylogs/sections/logsview.vue";
import { logs } from "@/api/logs";
export default {
  components: { banner, logsview },
  data() {
    return {
      logs: null,
      totalCount: null,
      currentPage: 0,
      search: null,
    };
  },

  methods: {
    async fetchLogs(page, search) {
      try {
        const response = await logs.get(page, search);
        this.totalCount = response.count;
        this.logs = response.results;
      } catch (error) {
        console.error(error);
      }
    },

    changePage(event) {
      let page = event.page;
      const query = this.$route.query;
      this.$router.push({ path: this.$route.path, query: { ...query, page } });
    },
  },

  watch: {
    "$route.query": {
      handler() {
        this.currentPage = this.$route.query.page
          ? parseInt(this.$route.query.page)
          : 0;
        this.fetchLogs(
          this.$route.query.page ? parseInt(this.$route.query.page) : 0,
          this.$route.query.search ? this.$route.query.search : null
        );
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
