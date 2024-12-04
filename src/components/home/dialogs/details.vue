<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Project Details"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <div class="col-10">
      <div class="field col-5">
        <p>Title</p>
        <p>{{ project?.title }}</p>
      </div>
      <div class="field col-5">
        <p>Pubmat</p>
        <img :src="project?.pubmat" style="width: 100%" />
      </div>
      <div class="field col-5">
        <p>ACM Paper</p>
        <a target="_blank" :href="project?.acm_paper">ACM Paper Link</a>
      </div>
      <div class="field col-5">
        <p>Approval Form</p>
        <a target="_blank" :href="project?.approval_form">Approval Form Link</a>
      </div>
      <div class="field col-5">
        <p>Source Code</p>
        <a target="_blank" :href="project?.source_code">Repo Link</a>
      </div>
      <div class="field col-5">
        <p>IP Registration</p>
        <a target="_blank" :href="project?.ip_registration"
          >IP Registration Link</a
        >
      </div>
    </div>
    <template #footer>
      <Button label="Close" text severity="contrast" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
export default {
  props: ["isVisible", "project"],
  data() {
    return {
      localVisible: true,
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
