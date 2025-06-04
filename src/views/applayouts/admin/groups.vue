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
        const response = await groups.getGroups(search, course);
        this.groups = response || [];
      } catch (error) {
        console.error(error);
      }
    },
  },

  watch: {
    "$route.query.search": {
      handler(newSearch) {
        if (newSearch === null || newSearch === undefined) {
          const { query, ...route } = this.$route;
          delete query.search;
          this.$router.push({ ...route, query });
          this.fetchGroups(
            null,
            this.$route.query.course ? this.$route.query.course : null
          );
        } else {
          this.fetchGroups(
            newSearch,
            this.$route.query.course ? this.$route.query.course : null
          );
        }
      },
      immediate: true,
    },
    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          console.log("pumasok");
          const { query, ...route } = this.$route;
          delete query.course;
          this.$router.push({ ...route, query });
          this.fetchGroups(
            this.$route.query.search ? this.$route.query.search : null,
            null
          );
        } else {
          this.fetchGroups(
            this.$route.query.search ? this.$route.query.search : null,
            newCourse
          );
        }
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
