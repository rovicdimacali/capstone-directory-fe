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
      this.$router.push({ path: this.$route.path, query: { page } });
    },
  },

  mounted() {
    this.startPolling();
  },

  beforeDestroy() {
    this.stopPolling();
  },

  watch: {
    "$route.query.page": {
      handler(newPage) {
        this.currentPage = newPage ? parseInt(newPage) : 0;
        this.fetchUsers(
          newPage ? parseInt(newPage) : 0,
          this.$route.query.search ? this.$route.query.search : null,
          this.$route.query.course ? this.$route.query.course : null,
          this.$route.query.role ? this.$route.query.role : null
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
          this.fetchUsers(
            0,
            null,
            this.$route.query.course ? this.$route.query.course : null,
            this.$route.query.role ? this.$route.query.role : null
          );
        } else {
          this.fetchUsers(
            0,
            newSearch ? newSearch : "",
            this.$route.query.course ? this.$route.query.course : null,
            this.$route.query.role ? this.$route.query.role : null
          );
        }
      },
    },

    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          const { query, ...route } = this.$route;
          delete query.course;
          this.$router.push({ ...route, query });
          this.fetchUsers(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            null,
            this.$route.query.role ? this.$route.query.role : null
          );
        } else {
          this.fetchUsers(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            newCourse ? newCourse : "",
            this.$route.query.role ? this.$route.query.role : null
          );
        }
      },
    },

    "$route.query.role": {
      handler(newRole) {
        if (newRole === null || newRole === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchUsers(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.course ? this.$route.query.course : null,
            null
          );
        } else {
          this.fetchUsers(
            0,
            this.$route.query.search ? this.$route.query.search : null,
            this.$route.query.course ? this.$route.query.course : null,
            newRole ? newRole : ""
          );
        }
      },
    },
  },
};
</script>

<style></style>
