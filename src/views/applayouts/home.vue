<template>
  <banner :title="'Capstone Directory'" />
  <dashboard />
  <dataview />
</template>

<script>
import banner from "@/layouts/banner.vue";
import dashboard from "@/components/home/sections/dashboard.vue";
import Dataview from "@/components/home/sections/dataview.vue";
export default {
  components: { banner, dashboard, Dataview },
};
</script>

<style></style>
