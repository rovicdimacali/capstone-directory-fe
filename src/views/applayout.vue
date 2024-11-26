<template>
  <Toast />
  <navbar />
  <router-view />
  <customfooter />
</template>

<script>
import navbar from "@/layouts/navbar.vue";
import customfooter from "@/layouts/customfooter.vue";
export default {
  components: { navbar, customfooter },
};
</script>

<style></style>
