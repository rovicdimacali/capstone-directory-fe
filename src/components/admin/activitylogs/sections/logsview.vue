<template>
  <div class="dataview">
    <div class="search-filter-container wrap">
      <div class="search-input col-5">
        <InputText
          v-model="search"
          placeholder="Search"
          @keyup.enter="handleSearch"
        />
        <small>Press Enter to Search</small>
      </div>
    </div>
    <div v-if="logs?.length" class="data-container">
      <DataTable :value="logs" tableStyle="min-width: 50rem; font-size: 13px">
        <Column field="action" header="Activity"></Column>

        <Column field="actor_name" header="User"></Column>
        <Column field="user.role" header="Role"></Column>
        <Column header="Date" style="text-transform: capitalize">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template></Column
        >
      </DataTable>
    </div>
    <div v-else class="data-container wrap">
      <p>No Data Available</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["logs"],

  data() {
    return {
      search: null,
    };
  },

  methods: {
    handleSearch() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    },

    formatDate(dateStr) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", options);
    },
  },

  watch: {
    "$route.query.search": {
      handler(newSearch) {
        if (newSearch === null || newSearch === undefined) {
          this.search = null;
        } else {
          this.search = newSearch;
        }
      },
      immediate: true,
    },
  },
};
</script>
