<template>
  <div class="datacard">
    <div class="header col">
      <h3>{{ project?.title }}</h3>
      <p>{{ formatDate(project?.date_published) }}</p>
    </div>

    <div v-if="this.role === 'Student'" class="actions-container row">
      <Button text label="ACM Paper" class="action-btn" />
      <Button text label="Full Paper" class="action-btn" />
      <Button text label="Details" class="action-btn" />
    </div>
    <div v-else class="actions-container row">
      <Button text label="Full Paper" class="action-btn" />
      <Button
        text
        label="Update"
        class="action-btn"
        @click="
          this.$router.push(`/upload?is_edit=true&project_id=${project?.id}`)
        "
      />
      <Button
        text
        label="Delete"
        class="action-btn"
        @click="deleteProject(project?.id)"
      />
    </div>
  </div>
</template>

<script>
import { capstone } from "@/api/capstone";

export default {
  props: ["project"],
  data() {
    return {
      role: null,
    };
  },
  methods: {
    formatDate(isoString) {
      const date = new Date(isoString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },

    deleteProject(id) {
      this.$confirm.require({
        message: "Are you sure you want to delete?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "No",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Yes",
        },
        accept: async () => {
          try {
            await capstone.delete(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Project Deleted Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not deleted successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");
  },
};
</script>

<style></style>
