<template>
  <div class="datacard">
    <assigngroup
      v-if="assignVisible"
      :isVisible="assignVisible"
      :user="users"
      @close="assignVisible = false"
      @submit="
        () => {
          assignVisible = false;
          this.$emit('refresh');
        }
      "
    />
    <updateuser
      v-if="updateVisible"
      :isVisible="updateVisible"
      :user="users"
      @close="updateVisible = false"
      @submit="
        () => {
          updateVisible = false;
          this.$emit('refresh');
        }
      "
    />
    <div class="header col">
      <h3>{{ users?.first_name }} {{ users?.last_name }}</h3>
      <p>
        {{ users?.course ? users?.course : "No Course" }} |
        <span style="text-transform: capitalize"> {{ users?.role }}</span>
      </p>
    </div>

    <div class="actions-container row">
      <Button
        v-if="users.role === 'student'"
        text
        label="Assign"
        class="action-btn"
        @click="assignVisible = true"
      />
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
        @click="deleteUser(users?.id)"
      />
    </div>
  </div>
</template>

<script>
import { users } from "@/api/users";
import updateuser from "../dialogs/updateuser.vue";
import assigngroup from "../dialogs/assigngroup.vue";
export default {
  props: ["users"],

  components: { updateuser, assigngroup },

  data() {
    return {
      assignVisible: false,
      updateVisible: false,
    };
  },

  methods: {
    deleteUser(id) {
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
            await users.deleteUser(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "User Deleted Successfully.",
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
