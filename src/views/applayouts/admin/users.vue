<template>
  <banner :title="'Users Management'" />
  <userview
    :users="users"
    @refresh="
      fetchUsers(
        this.$route.query.page ? parseInt(this.$route.query.page) : 0,
        this.$route.query.search ? this.$route.query.search : null,
        this.$route.query.course ? this.$route.query.course : null,
        this.$route.query.role ? this.$route.query.role : null
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
import userview from "@/components/admin/users/sections/userview.vue";
import { users } from "@/api/users";

export default {
  components: { banner, userview },
  data() {
    return {
      users: null,
      totalCount: null,
      currentPage: 0,
      search: null,
      intervalId: null,
    };
  },

  methods: {
    async fetchUsers(page, search, course, role) {
      try {
        const response = await users.getUsers(page, search, course, role);

        this.totalCount = response.count;
        this.users = response.results;
      } catch (error) {
        console.error(error);
      }
    },

    startPolling() {
      // Clear existing interval if already polling
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      // Set up a new interval to poll every 10 seconds
      this.intervalId = setInterval(() => {
        this.fetchUsers(
          this.page,
          this.$route.query.search ? this.$route.query.search : null,
          this.$route.query.course ? this.$route.query.course : null,
          this.$route.query.role ? this.$route.query.role : null
        );
      }, 10000);
    },

    stopPolling() {
      // Clear the interval to stop polling
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    changePage(event) {
      let page = event.page;
      const query = this.$route.query;
      this.$router.push({ path: this.$route.path, query: { ...query, page } });
    },
  },

  mounted() {
    this.startPolling();
  },

  beforeDestroy() {
    this.stopPolling();
  },

  watch: {
    "$route.query": {
      handler() {
        this.currentPage = this.$route.query.page
          ? parseInt(this.$route.query.page)
          : 0;
        this.fetchUsers(
          this.$route.query.page ? parseInt(this.$route.query.page) : 0,
          this.$route.query.search ? this.$route.query.search : null,
          this.$route.query.course ? this.$route.query.course : null,
          this.$route.query.role ? this.$route.query.role : null
        );
      },
      immediate: true, // Call the handler immediately on component mount
    },
  },
};
</script>

<style></style>
