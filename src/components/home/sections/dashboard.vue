<template>
  <div class="dashboard wrap">
    <card
      :title="'ALL'"
      :total="all ? all : 0"
      :img="'https://res.cloudinary.com/dpm5vdakr/image/upload/v1731589080/capstone_directory/d15d3f3c-51c4-4a1d-83ac-89d3309d8e27.png'"
      class="last"
      :class="this.$route.query.is_best_capstone === 'true' ? '' : 'active'"
      @click="this.$router.push(`/capstone-directory?page=0&is_approved=true`)"
    />
    <card
      :title="'BEST'"
      :total="best ? best : 0"
      :img="'https://res.cloudinary.com/dpm5vdakr/image/upload/v1731589100/capstone_directory/d3cccfab-1083-4f0f-a4fd-97698c0914f2.png'"
      class="first"
      :class="this.$route.query.is_best_capstone === 'true' ? 'active' : ''"
      @click="
        this.$router.push(
          `/capstone-directory?page=0&is_best_capstone=true&is_approved=true`
        )
      "
    />
  </div>
</template>

<script>
import card from "../card/card.vue";
export default {
  props: ["all", "best"],
  components: { card },
};
</script>

<style></style>
