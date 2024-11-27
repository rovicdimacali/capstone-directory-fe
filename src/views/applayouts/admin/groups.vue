<template>
  <banner :title="'Groups Management'" />
  <groupview :groups="groups" @refresh="fetchGroups()" />
</template>

<script>
import banner from "@/layouts/banner.vue";
import groupview from "@/components/admin/groups/sections/groupview.vue";
import { groups } from "@/api/groups";

export default {
  components: { banner, groupview },
  data() {
    return {
      groups: null,
      totalCount: null,
      currentPage: 0,
      search: null,
      intervalId: null,
    };
  },

  methods: {
    async fetchGroups(search, course) {
      try {
        const response = await groups.getGroups();
        this.groups = response || [];
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.fetchGroups();
  },

  watch: {
    // "$route.query.search": {
    //   handler(newSearch) {
    //     if (newSearch === null || newSearch === undefined) {
    //       const { query, ...route } = this.$route;
    //       delete query.search;
    //       this.$router.push({ ...route, query });
    //       this.fetchUsers(
    //         0,
    //         null,
    //         this.$route.query.course ? this.$route.query.course : null,
    //         this.$route.query.role ? this.$route.query.role : null
    //       );
    //     } else {
    //       this.fetchUsers(
    //         0,
    //         newSearch ? newSearch : "",
    //         this.$route.query.course ? this.$route.query.course : null,
    //         this.$route.query.role ? this.$route.query.role : null
    //       );
    //     }
    //   },
    // },
    // "$route.query.course": {
    //   handler(newCourse) {
    //     if (newCourse === null || newCourse === undefined) {
    //       const { query, ...route } = this.$route;
    //       delete query.course;
    //       this.$router.push({ ...route, query });
    //       this.fetchUsers(
    //         0,
    //         this.$route.query.search ? this.$route.query.search : null,
    //         null,
    //         this.$route.query.role ? this.$route.query.role : null
    //       );
    //     } else {
    //       this.fetchUsers(
    //         0,
    //         this.$route.query.search ? this.$route.query.search : null,
    //         newCourse ? newCourse : "",
    //         this.$route.query.role ? this.$route.query.role : null
    //       );
    //     }
    //   },
    // },
  },
};
</script>

<style></style>
