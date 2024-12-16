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
        {{ member?.last_name }} ({{ member?.email }})
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
      <Button
        v-if="isAdding"
        icon="pi pi-user-plus"
        label="Cancel"
        severity="info"
        @click="isAdding = false"
      />
      <MultiSelect
        v-if="isAdding"
        id="group"
        v-model="selectedGroup"
        :options="formattedGroups"
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
    </div>

    <template #footer>
      <Button label="Close" text severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
import { users } from "@/api/users";

export default {
  props: ["isVisible", "group"],
  data() {
    return {
      localVisible: true,
      groupForm: null,
      isLoading: false,
      validationErrors: {},
      courses: ["IT", "CS", "IS"],
      users: [],
      isAdding: false,
    };
  },
  computed: {
    formattedGroups() {
      // Ensure users is defined and not empty before mapping
      if (!this.users || !this.users.length) {
        return [];
      }
      return this.users.map((user) => ({
        ...user,
        label: `${user.first_name} ${user.last_name} (${user.student_number})`,
      }));
    },
  },

  methods: {
    closeDialog() {
      this.$emit("close");
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
