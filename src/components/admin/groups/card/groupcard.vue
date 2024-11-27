<template>
  <div class="datacard">
    <updategroup
      v-if="updateVisible"
      :isVisible="updateVisible"
      :group="group"
      @close="updateVisible = false"
      @submit="
        () => {
          updateVisible = false;
          this.$emit('refresh');
        }
      "
    />
    <div class="header col">
      <h3>{{ group?.name }}</h3>
      <p>
        A.Y. {{ group?.academic_year }} | {{ group?.course }} |
        {{ group?.group_members?.length }} members
      </p>
    </div>

    <div class="actions-container row">
      <Button text label="Members" class="action-btn" />
      <Button
        text
        label="Update"
        class="action-btn"
        @click="updateVisible = true"
      />
      <Button
        text
        label="Delete"
        class="action-btn"
        @click="deleteGroup(group?.id)"
      />
    </div>
  </div>
</template>

<script>
import { groups } from "@/api/groups";
import updategroup from "../dialogs/updategroup.vue";

export default {
  props: ["group"],

  components: { updategroup },

  data() {
    return {
      updateVisible: false,
    };
  },

  methods: {
    deleteGroup(id) {
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
            await groups.deleteGroup(id);
            this.$toast.add({
              severity: "success",
              summary: "Group Deleted Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "User was not deleted successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },
  },
};
</script>

<style></style>
