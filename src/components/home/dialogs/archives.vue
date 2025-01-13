<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Project Archives"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <div class="search-input col-5">
      <InputText
        v-model="search"
        placeholder="Search by title, keywords, date (YYYY-MM-DD), or academic year"
        @input="handleSearch"
      />
    </div>

    <div v-if="projects?.length" class="wrap">
      <datacard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :archived="true"
        @refresh="
          fetchArchives(
            this.$route.query.archivePage
              ? parseInt(this.$route.query.archivePage)
              : 0,
            this.$route.query.archiveSearch
              ? this.$route.query.archiveSearch
              : null
          )
        "
      />
    </div>
    <Paginator
      :rows="10"
      :totalRecords="totalCount"
      :first="currentPage * 10"
      @page="changePage"
    ></Paginator>
    <template #footer>
      <Button label="Close" text severity="contrast" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
import { capstone } from "@/api/capstone";
import debounce from "lodash/debounce";

export default {
  props: ["isVisible", "project"],
  data() {
    return {
      localVisible: true,
      archives: null,
      totalCount: null,
      currentPage: 0,
    };
  },

  methods: {
    async fetchArchives(page, search) {
      try {
        const response = await capstone.getArchives(page, search);
        this.archives = response.results || [];
        this.totalCount = response.count;
      } catch (error) {}
    },

    handleSearch: debounce(function () {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    }, 300),

    changePage(event) {
      let archivePage = event.page;
      const query = this.$route.query;
      this.$router.push({
        path: this.$route.path,
        query: { ...query, archivePage },
      });
    },

    closeDialog() {
      this.$emit("close");
    },
  },

  mounted() {
    this.fetchArchives(
      this.$route.query.archivePage
        ? parseInt(this.$route.query.archivePage)
        : 0,
      this.$route.query.archiveSearch ? this.$route.query.archiveSearch : null
    );
  },

  watch: {
    isVisible(newVal) {
      this.localVisible = newVal;
    },
    localVisible(newVal) {
      this.$emit("update:isVisible", newVal);
    },
    "$route.query": {
      handler() {
        this.currentPage = this.$route.query.archivePage
          ? parseInt(this.$route.query.archivePage)
          : 0;

        this.fetchArchives(
          this.$route.query.archivePage
            ? parseInt(this.$route.query.archivePage)
            : 0,
          this.$route.query.archiveSearch
            ? this.$route.query.archiveSearch
            : null
        );
      },
    },
  },
};
</script>

<style></style>
