<template>
  <banner :title="'Upload Capstone'" />
  <uploadview />
</template>

<script>
import banner from "@/layouts/banner.vue";
import uploadview from "@/components/upload/uploadview.vue";
export default {
  components: { banner, uploadview },
};
</script>

<style></style>
