<template>
  <banner :title="'Users Management'" />
  <userview :users="users" />
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
    };
  },

  methods: {
    async fetchUsers(page, search) {
      try {
        const response = await users.getUsers(page, search);

        this.totalCount = response.count;
        this.users = response.results;
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
        this.fetchUsers(
          newPage ? parseInt(newPage) : 0,
          this.$route.query.search ? this.$route.query.search : null
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
          this.fetchUsers(0, null);
        } else {
          this.fetchUsers(0, newSearch ? newSearch : "");
        }
      },
    },
  },
};
</script>

<style></style>
