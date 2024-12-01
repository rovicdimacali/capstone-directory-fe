<template>
  <div class="dataview">
    <form
      class="upload-form col"
      style="gap: 20px"
      @submit.prevent="uploadCapstone"
    >
      <div class="input-container col-5">
        <label for="group"
          >Group
          <span
            ><small
              >(If your group is not present, kindly skip this field and enter
              the members below)</small
            ></span
          ></label
        >
        <Select
          id="group"
          v-model="selectedGroup"
          optionLabel="name"
          :options="groups"
          placeholder="Select a Group"
          style="max-width: 550px"
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
      </div>
      <div class="input-container col-5">
        <label for="members">Members</label>
        <InputText
          id="members"
          v-model="uploadForm.members[0]"
          placeholder="Member 1"
        />
        <InputText
          id="members"
          v-model="uploadForm.members[1]"
          placeholder="Member 2"
        />
        <InputText
          id="members"
          v-model="uploadForm.members[2]"
          placeholder="Member 3"
        />
        <InputText
          id="members"
          v-model="uploadForm.members[3]"
          placeholder="Member 4"
        />
        <small v-if="validationErrors?.members" style="color: red">{{
          validationErrors?.members
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="title">Title</label>
        <InputText
          id="title"
          v-model="uploadForm.title"
          placeholder="Capstone Project Title"
        />
        <small v-if="validationErrors?.title" style="color: red">{{
          validationErrors?.title
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="date_published">Date Published</label>
        <DatePicker
          id="date_published"
          :maxDate="new Date()"
          v-model="uploadForm.date_published"
          style="max-width: 350px"
          placeholder="Select Date"
          format="yy-mm-dd"
        />
        <small v-if="validationErrors?.date_published" style="color: red">{{
          validationErrors?.date_published
        }}</small>
      </div>

      <div class="input-container col-5">
        <label for="city">ACM Paper</label>
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              name="acm_paper"
              mode="basic"
              accept=".pdf"
              :auto="false"
              :customUpload="true"
              @select="onFileSelect"
              :maxFileSize="5000000"
            />
          </div>
        </div>
        <small v-if="validationErrors?.acm_paper" style="color: red">{{
          validationErrors?.acm_paper
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="city">Full Document</label>
        <InputText
          id="members"
          v-model="uploadForm.full_document"
          placeholder="GDrive Link of Full Document"
        />
        <small v-if="validationErrors?.full_document" style="color: red">{{
          validationErrors?.full_document
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="city">Pubmat</label>
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              mode="basic"
              :auto="true"
              :customUpload="true"
              @uploader="uploadPubmatToCloudinary"
              :multiple="false"
              accept="image/*"
              chooseLabel="Upload Pubmat"
              :maxFileSize="5000000"
            >
            </FileUpload>
          </div>
          <ProgressSpinner
            v-if="isPubmatUploading"
            style="width: 30px; height: 30px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
            class="spinner"
          />
          <small v-if="pubmatName">Uploaded: {{ pubmatName }}</small>
        </div>
        <small v-if="validationErrors?.pubmat" style="color: red">{{
          validationErrors?.pubmat
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="city">Approval Form</label>
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              mode="basic"
              :auto="true"
              :customUpload="true"
              @uploader="uploadApprovalToCloudinary"
              :multiple="false"
              accept=".pdf"
              chooseLabel="Upload Approval Form"
              :maxFileSize="5000000"
            >
            </FileUpload>
          </div>
          <ProgressSpinner
            v-if="isApprovalUploading"
            style="width: 30px; height: 30px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
            class="spinner"
          />
          <small v-if="approvalName">Uploaded: {{ approvalName }}</small>
        </div>
        <small v-if="validationErrors?.approval_form" style="color: red">{{
          validationErrors?.approval_form
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="city">IP Registration</label>
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              mode="basic"
              :auto="true"
              :customUpload="true"
              @uploader="uploadIPToCloudinary"
              :multiple="false"
              accept=".pdf"
              chooseLabel="Upload IP Registration"
              :maxFileSize="5000000"
            >
            </FileUpload>
          </div>
          <ProgressSpinner
            v-if="isIPUploading"
            style="width: 30px; height: 30px"
            strokeWidth="8"
            fill="transparent"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
            class="spinner"
          />
          <small v-if="ipName">Uploaded: {{ ipName }}</small>
        </div>
      </div>
      <div class="input-container col-5">
        <label for="source_code"
          >Source Code <span><small>(Git Link)</small></span></label
        >
        <InputText
          id="source_code"
          v-model="uploadForm.source_code"
          placeholder="e.g. git@github.com:user/sample-repo.git"
        />
        <small v-if="validationErrors?.source_code" style="color: red">{{
          validationErrors?.source_code
        }}</small>
      </div>
      <div class="row" style="justify-content: center">
        <Button
          label="Submit Capstone"
          style="margin-block: 20px; min-width: 310px; max-width: 400px"
          type="submit"
          :loading="isLoading"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { groups } from "@/api/groups";
import { cloudinary } from "@/api/cloudinary";
import { capstone } from "@/api/capstone";
import * as Yup from "yup";
export default {
  data() {
    return {
      uploadForm: {
        capstone_group_id: null,
        title: null,
        ip_regristration: null,
        acm_paper: null,
        full_document: null,
        pubmat: null,
        approval_form: null,
        source_code: null,
        members: [],
        date_published: null,
      },
      groups: null,
      pubmatName: null,
      isPubmatUploading: false,
      approvalName: null,
      isApprovalUploading: false,
      ipName: null,
      isIPUploading: false,
      selectedGroup: null,
      isLoading: false,
      validationErrors: null,
    };
  },

  validations: {
    uploadForm: {
      title: { required: true },
      full_document: { required: true },
      acm_paper: { required: true },
      pubmat: { required: true },
      source_code: { required: true },
      approval_form: { required: true },
      date_published: { required: true },
    },
  },

  methods: {
    onFileSelect(event) {
      this.uploadForm.acm_paper = event.files[0];
    },

    async fetchProject(id) {
      try {
        const response = await capstone.getByID(id);

        // Extract capstone_group_id from the response
        let groupID = response.capstone_group ? response.capstone_group : null;

        // Create a copy of the response without the keyword field
        const filteredResponse = { ...response };
        delete filteredResponse.keywords;

        // Assign other properties to uploadForm
        Object.assign(this.uploadForm, {
          ...filteredResponse,
          members: filteredResponse.members || [],
          date_published: new Date(filteredResponse.date_published),
        });

        this.fetchGroup(groupID);
      } catch (error) {
        console.error(error);
      }
    },

    async fetchGroup(groupID) {
      try {
        const response = await groups.getGroup(groupID);

        const { id, name, group_members } = response;
        this.selectedGroup = { id, name, group_members };
      } catch (error) {
        console.error(error);
      }
    },

    async fetchGroups() {
      try {
        const response = await groups.getGroups();

        this.groups = response.map((item) => ({
          id: item.id,
          name: item.name,
          group_members: item.group_members,
        }));
      } catch (error) {
        console.error(error);
      }
    },

    async uploadPubmatToCloudinary(event) {
      this.isPubmatUploading = true;
      const file = event.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET
      );
      formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);
      try {
        const response = await cloudinary.upload(formData);
        this.pubmatName = file.name;
        this.uploadForm.pubmat = response.url;
      } catch (error) {
        console.error("Failed to upload file: ", error);
      } finally {
        this.isPubmatUploading = false;
      }
    },

    async uploadApprovalToCloudinary(event) {
      this.isApprovalUploading = true;
      const file = event.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET
      );
      formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);
      try {
        const response = await cloudinary.upload(formData);
        this.approvalName = file.name;
        this.uploadForm.approval_form = response.url;
      } catch (error) {
        console.error("Failed to upload file: ", error);
      } finally {
        this.isApprovalUploading = false;
      }
    },

    async uploadIPToCloudinary(event) {
      this.isIPUploading = true;
      const file = event.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET
      );
      formData.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);
      try {
        const response = await cloudinary.upload(formData);
        this.ipName = file.name;
        this.uploadForm.ip_regristration = response.url;
      } catch (error) {
        console.error("Failed to upload file: ", error);
      } finally {
        this.isIPUploading = false;
      }
    },

    async validateForm() {
      try {
        await Yup.object()
          .shape({
            capstone_group_id: Yup.string().nullable(), // optional
            title: Yup.string().required("Title is required"),
            ip_regristration: Yup.string().nullable(), // optional
            acm_paper: Yup.string().required("ACM Paper is required"),
            full_document: Yup.string()
              .required("Full document is required")
              .matches(
                /^https:\/\/drive\.google\.com\/.+$/,
                "Full document must be a valid Google Drive link"
              ),
            pubmat: Yup.string().required("Pubmat is required"),
            approval_form: Yup.string().nullable(), // optional
            source_code: Yup.string().required("Source code is required"),
            approval_form: Yup.string().required("Source code is required"),
            members: Yup.array()
              .of(Yup.string().required("Member name is required"))
              .min(3, "At least 3 members are required"),
            date_published: Yup.date().required("Date published is required"),
          })
          .validate(this.uploadForm, { abortEarly: false });

        this.validationErrors = {}; // Clear previous errors
        return true; // Form is valid
      } catch (error) {
        console.log(error);

        this.validationErrors = {};
        error.inner.forEach((err) => {
          this.validationErrors[err.path] = err.message;
        });

        return false; // Form is invalid
      }
    },

    async uploadCapstone() {
      this.isLoading = true;
      this.uploadForm.capstone_group_id = this.selectedGroup
        ? this.selectedGroup.id
        : null;
      this.uploadForm.members = this.uploadForm.members.filter(
        (name) => name !== ""
      );
      this.uploadForm.date_published = this.uploadForm?.date_published
        ?.toISOString()
        ?.split("T")[0];
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        try {
          if (this.$route.query.is_edit === "true") {
            await capstone.update(
              this.$route.query.project_id,
              this.uploadForm
            );
          } else {
            await capstone.create(this.uploadForm);
          }
          this.$toast.add({
            severity: "success",
            summary:
              this.$route.query.is_edit === "true"
                ? "Capstone Updated Successfully."
                : "Capstone Uploaded Successfully.",
            life: 3000,
          });
        } catch (error) {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "User was not deleted successfully.",
            life: 3000,
          });
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    this.fetchGroups();
    if (this.$route.query.is_edit === "true") {
      await this.fetchProject(this.$route.query.project_id);
    }
  },
  watch: {
    selectedGroup: {
      handler(newValue) {
        this.uploadForm.members[0] = newValue.group_members[0]
          ? `${newValue.group_members[0].first_name} ${newValue.group_members[0].last_name}`
          : "";
        this.uploadForm.members[1] = newValue.group_members[1]
          ? `${newValue.group_members[1].first_name} ${newValue.group_members[1].last_name}`
          : "";
        this.uploadForm.members[2] = newValue.group_members[2]
          ? `${newValue.group_members[2].first_name} ${newValue.group_members[2].last_name}`
          : "";
        this.uploadForm.members[3] = newValue.group_members[3]
          ? `${newValue.group_members[3].first_name} ${newValue.group_members[3].last_name}`
          : "";
      },
    },
    "$route.query.is_edit": {
      handler(newValue) {
        if (newValue === null || newValue === undefined) {
          this.uploadForm = {
            capstone_group_id: null,
            title: null,
            ip_regristration: null,
            acm_paper: null,
            full_document: null,
            pubmat: null,
            approval_form: null,
            source_code: null,
            members: [],
            date_published: null,
          };
        }
      },
    },
  },
};
</script>
