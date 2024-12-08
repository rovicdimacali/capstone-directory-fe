<template>
  <assigngroup
    v-if="assignVisible"
    :isVisible="assignVisible"
    :user="selectedUserAssign"
    @close="assignVisible = false"
    @submit="
      () => {
        assignVisible = false;
        this.$emit('refresh');
      }
    "
  />
  <updateuser
    v-if="updateVisible"
    :isVisible="updateVisible"
    :user="selectedUserUpdate"
    @close="updateVisible = false"
    @submit="
      () => {
        updateVisible = false;
        this.$emit('refresh');
      }
    "
  />
  <div class="dataview">
    <createuser
      v-if="createVisible"
      :isVisible="createVisible"
      :user="users"
      @close="createVisible = false"
      @submit="
        () => {
          createVisible = false;
          this.$emit('refresh');
        }
      "
    />
    <div class="search-filter-container wrap">
      <div class="search-input col-5">
        <InputText
          v-model="search"
          placeholder="Search"
          @keyup.enter="handleSearch"
        />
        <small>Press Enter to Search</small>
      </div>

      <Select
        v-model="selectedCourse"
        :options="courses"
        placeholder="Select Program"
        class="dropdown"
        @change="handleCourseChange"
        showClear
      />
      <Select
        v-if="role === 'administrator' || role === 'capstone coordinator'"
        v-model="selectedRole"
        :options="roles"
        placeholder="Select Role"
        class="dropdown"
        @change="handleRoleChange"
        showClear
      />
      <Button
        v-if="role === 'administrator'"
        label="Create User"
        @click="createVisible = true"
      />
      <FileUpload
        v-if="role === 'administrator'"
        mode="basic"
        name="demo[]"
        accept=".xlsx"
        :maxFileSize="1000000"
        customUpload
        @select="onUpload"
        :auto="true"
        chooseLabel="Upload Users"
      />
      <ProgressSpinner
        v-if="isUploading"
        style="width: 20px; height: 20px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div v-if="users?.length" class="data-container">
      <DataTable :value="users" tableStyle="min-width: 50rem; font-size: 13px">
        <Column field="student_number" header="Student No."></Column>
        <Column header="Name">
          <template #body="slotProps">
            {{ slotProps.data.first_name }} {{ slotProps.data.last_name }}
          </template></Column
        >

        <Column field="email" header="Email"></Column>
        <Column
          field="role"
          header="Role"
          style="text-transform: capitalize"
        ></Column>
        <Column
          field="course"
          header="Program"
          style="text-transform: capitalize"
        ></Column>
        <Column
          field="specialization"
          header="Specialization"
          style="text-transform: capitalize"
        ></Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="col-5">
              <Button
                v-if="slotProps.data.role === 'student'"
                severity="info"
                label="Assign"
                class="action-btn"
                @click="
                  () => {
                    assignVisible = true;
                    selectedUserAssign = slotProps.data;
                  }
                "
              />
              <Button
                v-if="role === 'administrator'"
                severity="contrast"
                label="Update"
                class="action-btn"
                @click="
                  () => {
                    updateVisible = true;
                    selectedUserUpdate = slotProps.data;
                  }
                "
              />
              <Button
                v-if="role === 'administrator'"
                label="Delete"
                class="action-btn"
                @click="deleteUser(slotProps.data?.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else class="data-container wrap">
      <p>No Data Available</p>
    </div>
  </div>
</template>

<script>
import { users } from "@/api/users";
import createuser from "../dialogs/createuser.vue";
import updateuser from "../dialogs/updateuser.vue";
import assigngroup from "../dialogs/assigngroup.vue";

export default {
  props: ["users"],
  components: { createuser, updateuser, assigngroup },

  data() {
    return {
      search: null,
      selectedCourse: null,
      selectedRole: null,
      courses: ["IT", "CS", "IS"],
      createVisible: false,
      isUploading: false,
      roles: null,
      role: null,
      assignVisible: false,
      updateVisible: false,
      selectedUserAssign: null,
      selectedUserUpdate: null,
    };
  },

  methods: {
    handleSearch() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, search: this.search } });
    },

    handleCourseChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, course: this.selectedCourse } });
    },

    handleRoleChange() {
      const query = this.$route.query;
      this.$router.push({ query: { ...query, role: this.selectedRole } });
    },

    async onUpload(event) {
      this.isUploading = true;
      try {
        const file = event.files[0];
        await users.uploadUsers({ file });
        this.$toast.add({
          severity: "success",
          summary: "Success",
          detail: "Upload process started in background",
          life: 3000,
        });
      } catch (error) {
        console.error(error);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message
            ? error.message
            : "CSV File Upload was unsuccessful",
          life: 3000,
        });
      } finally {
        this.isUploading = false;
      }
    },

    deleteUser(id) {
      this.$confirm.require({
        message: "Are you sure you want to delete?",
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
            await users.deleteUser(id);
            this.$toast.add({
              severity: "success",
              summary: "Success",
              detail: "User Deleted Successfully.",
              life: 3000,
            });
            this.$emit("refresh");
          } catch (error) {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: "User was not deleted successfully.",
              life: 3000,
            });
          }
        },
        reject: () => {},
      });
    },
  },

  mounted() {
    this.role = localStorage.getItem("role");

    if (this.role === "capstone coordinator") {
      this.roles = ["student", "faculty"];
    } else if (this.role === "administrator") {
      this.roles = [
        "student",
        "faculty",
        "capstone coordinator",
        "administrator",
      ];
    }
  },

  watch: {
    "$route.query.search": {
      handler(newSearch) {
        if (newSearch === null || newSearch === undefined) {
          this.search = null;
        } else {
          this.search = newSearch;
        }
      },
      immediate: true,
    },
    "$route.query.course": {
      handler(newCourse) {
        if (newCourse === null || newCourse === undefined) {
          this.selectedCourse = null;
        } else {
          this.selectedCourse = newCourse;
        }
      },
      immediate: true,
    },
    "$route.query.role": {
      handler(newRole) {
        if (newRole === null || newRole === undefined) {
          this.selectedRole = null;
        } else {
          this.selectedRole = newRole;
        }
      },
      immediate: true,
    },
  },
};
</script>
