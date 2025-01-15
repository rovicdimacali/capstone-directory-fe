<template>
  <Dialog
    v-model:visible="localVisible"
    modal
    header="Assign to a Group"
    :style="{ width: '40rem' }"
    :breakpoints="{ '40rem': '40rem', '575px': '90vw' }"
    @hide="
      () => {
        this.$emit('close');
      }
    "
  >
    <div
      class="wrap"
      style="align-items: center; justify-content: center; gap: 10px"
    >
      <div class="input-container col-5" style="flex-grow: 1">
        <label for="role">Group</label>
        <Select
          v-model="userForm.group"
          optionLabel="name"
          optionValue="id"
          :options="groups"
          placeholder="Select a Group"
          filter
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <div>
                {{ slotProps.option.name }} {{ slotProps.option.academic_year }}
              </div>
            </div>
          </template></Select
        >
        <small v-if="validationErrors.group" style="color: red">{{
          validationErrors.role
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" text severity="secondary" @click="closeDialog" />
      <Button
        label="Assign"
        severity="contrast"
        @click="updateUser"
        :loading="isLoading"
      />
    </template>
  </Dialog>
</template>

<script>
import { groups } from "@/api/groups";
import { users } from "@/api/users";
import * as Yup from "yup";

export default {
  props: ["isVisible", "user"],
  data() {
    return {
      localVisible: true,
      userForm: null,
      isLoading: false,
      validationErrors: {},
      groups: null,
    };
  },

  validations: {
    userForm: {
      group: { required: true },
    },
  },

  methods: {
    async validateForm() {
      try {
        await Yup.object()
          .shape({
            group: Yup.string().required("Group is required"),
          })
          .validate(this.userForm, { abortEarly: false });

        this.validationErrors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        this.validationErrors = {};
        error.inner.forEach((err) => {
          this.validationErrors[err.path] = err.message;
        });
        return false; // Form is invalid
      }
    },

    async updateUser() {
      if (this.validateForm()) {
        this.isLoading = true;
        try {
          await users.updateUser(this.user.id, this.userForm);
          this.$toast.add({
            severity: "success",
            summary: "User Updated",
            detail: "User assigned successfully!",
            life: 3000,
          });

          this.$emit("submit");
        } catch (error) {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "Uh-oh!",
            detail: "Something went wrong.",
            life: 3000,
          });
        } finally {
          this.isLoading = false;
        }
      }
    },

    closeDialog() {
      this.$emit("close");
    },

    async fetchGroups() {
      try {
        const response = await groups.getGroups();
        this.groups = response.map((item) => ({
          id: item.id,
          name: item.name,
        }));
      } catch (error) {
        console.error(error);
      }
    },
  },

  async mounted() {
    this.userForm = this.user;
    this.fetchGroups();
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
