<template>
  <detailsdialog
    v-if="detailsVisible"
    :isVisible="detailsVisible"
    :project="project"
    @close="detailsVisible = false"
  />
  <div class="datacard" style="flex-basis: 100%; width: 100%; max-width: unset">
    <div class="header col">
      <h3>{{ project?.title }}</h3>
      <p>{{ project?.date_published }}</p>
    </div>

    <div
      v-if="
        (this.role === 'student' || this.role === null) &&
        this.$route.fullPath !==
          '/capstone-directory?page=0&is_approved=true&is_ip_registered=true'
      "
      class="actions-container wrap"
      style="gap: 5px"
    >
      <a :href="project?.acm_paper" target="_blank"
        ><Button
          text
          label="ACM Paper"
          severity="contrast"
          class="action-btn"
          raised
      /></a>
      <Button
        v-if="
          this.$route.query.is_approved === 'pending' ||
          this.$route.query.is_approved === 'false'
        "
        text
        label="Update"
        class="action-btn"
        severity="info"
        @click="
          this.$router.push(`/upload?is_edit=true&project_id=${project?.id}`)
        "
        raised
      />
    </div>
    <div
      v-else-if="
        this.$route.fullPath !==
        '/capstone-directory?page=0&is_approved=true&is_ip_registered=true'
      "
      class="actions-container wrap"
      style="gap: 5px"
    >
      <a :href="project?.full_document" target="_blank"
        ><Button
          label="Full Paper"
          severity="contrast"
          class="action-btn"
          text
          raised
      /></a>
      <Button
        label="Details"
        class="action-btn"
        severity="success"
        @click="detailsVisible = true"
        text
        raised
      />
      <Button
        v-if="role === 'administrator'"
        label="Update"
        class="action-btn"
        severity="info"
        @click="
          this.$router.push(`/upload?is_edit=true&project_id=${project?.id}`)
        "
        text
        raised
      />

      <Button
        v-if="role === 'administrator'"
        label="Archive"
        class="action-btn"
        @click="deleteProject(project?.id)"
        text
        raised
      />
      <Button
        v-if="
          role === 'administrator' &&
          project?.is_best_project === false &&
          project?.is_approved !== 'false' &&
          project?.is_approved !== 'pending'
        "
        icon="pi pi-check"
        label="Best Project"
        class="action-btn"
        severity="help"
        @click="bestProject(project?.id)"
        text
        raised
      />
      <Button
        v-if="
          role === 'administrator' &&
          project?.is_best_project === true &&
          project?.is_approved !== 'false' &&
          project?.is_approved !== 'pending'
        "
        icon="pi pi-times"
        label="Best Project"
        class="action-btn"
        severity="help"
        @click="unbestProject(project?.id)"
        text
        raised
      />
      <Button
        v-if="
          role === 'administrator' &&
          this.$route.query.is_approved === 'pending'
        "
        label="Approve"
        class="action-btn"
        severity="warn"
        @click="approveProject(project?.id)"
        text
        raised
      />
      <Button
        v-if="
          role === 'administrator' &&
          this.$route.query.is_approved === 'pending'
        "
        label="Reject"
        class="action-btn"
        severity="secondary"
        @click="rejectProject(project?.id)"
        text
        raised
      />
    </div>
    <div v-else class="actions-container wrap" style="gap: 5px">
      <a :href="project?.ip_registration" target="_blank"
        ><Button
          text
          label="IP Registration"
          severity="contrast"
          class="action-btn"
          raised
      /></a>
    </div>
  </div>
</template>

<script>
import { capstone } from "@/api/capstone";
import detailsdialog from "../dialogs/details.vue";

export default {
  props: ["project"],
  components: { detailsdialog },
  data() {
    return {
      role: null,
      detailsVisible: false,
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
        message: "Are you sure you want to archive?",
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
              detail: "Project Archived Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not archived successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },

    approveProject(id) {
      this.$confirm.require({
        message: "Are you sure you want to approve?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "No",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          severity: "success",
          label: "Yes",
        },
        accept: async () => {
          try {
            await capstone.approve(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Project Approved Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not approved successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },

    rejectProject(id) {
      this.$confirm.require({
        message: "Are you sure you want to reject?",
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
            await capstone.reject(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Project Rejected Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not rejected successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },

    bestProject(id) {
      this.$confirm.require({
        message: "Are you sure you want to promote this project?",
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
            await capstone.best_project(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Project Promoted Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
            this.$emit("bestProject");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not promoted successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },

    unbestProject(id) {
      this.$confirm.require({
        message: "Are you sure you want to demote this project?",
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
            await capstone.unbest_project(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "Project Demoted Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
            this.$emit("bestProject");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "Project was not demoted successfully.",
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
    console.log(this.$route.fullPath);
  },
};
</script>

<style></style>
