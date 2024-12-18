<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Members"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <ul>
      <li v-for="(member, index) in group.group_members" :key="index">
        {{ member?.first_name }}
        {{ member?.last_name }} ({{ member?.email }}) &nbsp;&nbsp;&nbsp;
        <i
          class="pi pi-trash"
          style="color: red; cursor: pointer"
          @click="unassign(member)"
        ></i>
      </li>
    </ul>
    <Button
      v-if="!isAdding"
      icon="pi pi-user-plus"
      label="Add Members"
      severity="info"
      @click="isAdding = true"
    />
    <div class="row-10">
      <MultiSelect
        v-if="isAdding"
        id="group"
        v-model="groupForm.members"
        :options="formattedUsers"
        optionValue="id"
        optionLabel="label"
        placeholder="Select Members"
        style="max-width: 550px"
        filter
        :selectionLimit="4 - group?.group_members.length"
      >
        <template #option="slotProps">
          <div class="flex items-center">
            <div>
              {{ slotProps.option.first_name }}
              {{ slotProps.option.last_name }} ({{
                slotProps.option.student_number
              }})
            </div>
          </div>
        </template></MultiSelect
      >
      <Button
        v-if="isAdding"
        icon="pi pi-check"
        label="Submit"
        severity="success"
        :loading="isLoading"
        @click="assign"
      />
      <Button
        v-if="isAdding"
        icon="pi pi-times"
        label="Cancel"
        severity="danger"
        @click="isAdding = false"
      />
    </div>

    <template #footer>
      <Button label="Close" text severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
import { users } from "@/api/users";
import { groups } from "@/api/groups";

export default {
  props: ["isVisible", "group"],
  data() {
    return {
      localVisible: true,
      groupForm: { group_id: null, members: [] },
      isLoading: false,
      validationErrors: {},
      courses: ["IT", "CS", "IS"],
      users: [],
      isAdding: false,
      isLoading: false,
    };
  },
  computed: {
    formattedUsers() {
      // Ensure users is defined and not empty before mapping
      if (!this.users || !this.users.length) {
        return [];
      }

      // Extract group_members from the group prop
      const { group_members } = this.group;

      return this.users
        .map((user) => {
          // Filter out users that are part of group_members
          const isGroupMember = group_members.some(
            (member) => member.id === user.id
          );

          if (isGroupMember) {
            // Exclude group members
            return null;
          }

          return {
            ...user,
            label: `${user.first_name} ${user.last_name} (${user.student_number})`,
          };
        })
        .filter((user) => user !== null); // Remove null values
    },
  },

  methods: {
    closeDialog() {
      this.$emit("close");
    },

    async assign() {
      this.isLoading = true;
      try {
        await groups.assignMembers(this.groupForm);
        this.$toast.add({
          severity: "success",
          summary: "Member/s Assigned Successfully.",
          life: 3000,
        });
        this.$emit("refresh");
        this.groupForm.members = [];
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Member/s was not assigned successfully.",
          life: 3000,
        });
      } finally {
        this.isLoading = false;
      }
    },

    unassign(member) {
      this.$confirm.require({
        message: "Are you sure you want to remove this user from the group?",
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
            await users.updateUser(member.id, { group: null });
            this.$toast.add({
              severity: "success",
              summary: "User Unassigned Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "User was not unassigned successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },

    async fetchUsers(course) {
      try {
        const response = await users.getSpecificUsers(course);
        this.users = response || [];
      } catch (error) {
        console.error(error);
      }
    },
  },

  mounted() {
    this.groupForm.group_id = this.group.id;

    this.fetchUsers(this.group.course);
  },

  watch: {
    isVisible(newVal) {
      this.localVisible = newVal;
    },
    localVisible(newVal) {
      this.$emit("update:isVisible", newVal);
    },
  },
};
</script>

<style></style>
