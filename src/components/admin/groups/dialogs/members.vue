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
    <template #footer>
      <Button label="Close" text severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
export default {
  props: ["isVisible", "group"],
  data() {
    return {
      localVisible: true,
      groupForm: null,
      isLoading: false,
      validationErrors: {},
      courses: ["IT", "CS", "IS"],
    };
  },

  methods: {
    closeDialog() {
      this.$emit("close");
    },
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
