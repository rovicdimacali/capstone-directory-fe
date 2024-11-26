<template>
  <div class="datacard">
    <div class="header col">
      <h3>{{ users?.first_name }} {{ users?.last_name }}</h3>
      <p>
        {{ users?.course ? users?.course : "No Course" }} |
        <span style="text-transform: capitalize"> {{ users?.role }}</span>
      </p>
    </div>

    <div class="actions-container row">
      <Button text label="Assign" class="action-btn" />
      <Button text label="Update" class="action-btn" />
      <Button text label="Delete" class="action-btn" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["users"],
};
</script>

<style></style>
