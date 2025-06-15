<template>
  <div class="dataview">
    <form
      class="upload-form col"
      style="gap: 20px"
      @submit.prevent="uploadCapstone"
    >
      <div v-if="role !== 'student'" class="input-container col-5">
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
          @change="dynamicMemberCount"
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

      <div
        v-if="selectedGroup?.max_members && role !== 'student'"
        class="input-container col-5"
      >
        <label for="members">Members <span style="color: red">*</span></label>

        <div v-for="(member, index) in selectedGroup?.max_members" :key="index">
          <InputText
            :id="`member-${index}`"
            v-model="uploadForm.members[index]"
            :placeholder="`Member ${index + 1}`"
          />
        </div>
        <small v-if="validationErrors?.members" style="color: red">
          {{ validationErrors.members }}
        </small>
      </div>
      <div class="input-container col-5">
        <label for="title">Title <span style="color: red">*</span></label>
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
        <label for="date_published"
          >Date of Defense <span style="color: red">*</span></label
        >
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
        <label for="academic_year"
          >Academic Year <span style="color: red">*</span></label
        >
        <Select
          v-model="uploadForm.academic_year"
          :options="academic_years"
          placeholder="Academic Year"
          :disabled="role === 'student'"
        />
        <small v-if="validationErrors?.academic_year" style="color: red">{{
          validationErrors?.academic_year
        }}</small>
      </div>

      <div class="input-container col-5">
        <label for="city"
          >ACM Paper (5MB Max Size) <span style="color: red">*</span></label
        >
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
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.acm_paper"
              >{{ uploadForm.acm_paper }}</a
            ></small
          >
        </div>
      </div>
      <div class="input-container col-5">
        <label for="city"
          >Full Document (520MB Max Size)
          <span style="color: red">*</span></label
        >
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              name="full_document"
              mode="basic"
              accept=".pdf"
              :auto="false"
              :customUpload="true"
              @select="onFullPaperFileSelect"
              :maxFileSize="524288000"
            />
          </div>
        </div>
        <small v-if="validationErrors?.full_document" style="color: red">{{
          validationErrors?.full_document
        }}</small>
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.full_document"
              >{{ uploadForm.full_document }}</a
            ></small
          >
        </div>
      </div>
      <div class="input-container col-5">
        <label for="city"
          >Pubmat (5MB Max Size) <span style="color: red">*</span></label
        >
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
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.pubmat"
              >{{ uploadForm.pubmat }}</a
            ></small
          >
        </div>
      </div>
      <div class="input-container col-5">
        <label for="city"
          >Approval Form (5MB Max Size) <span style="color: red">*</span></label
        >
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
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.approval_form"
              >{{ uploadForm.approval_form }}</a
            ></small
          >
        </div>
      </div>
      <div class="input-container col-5">
        <label for="city"
          >IP Registration (5MB Max Size)
          <span style="color: red">*</span></label
        >
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
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.ip_regristration"
              >{{ uploadForm.ip_regristration }}</a
            ></small
          >
        </div>
      </div>
      <div class="input-container col-5">
        <label for="source_code"
          >Tags <span><small>(Press ENTER to separate tags.)</small></span
          ><span style="color: red">*</span></label
        >

        <AutoComplete
          v-model="uploadForm.tags"
          inputId="multiple-ac-2"
          multiple
          fluid
          :typeahead="false"
        />
        <small v-if="validationErrors?.tags" style="color: red">{{
          validationErrors?.tags
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="source_code"
          >Source Code (ZIP File 5MB Max Size)
          <span style="color: red">*</span></label
        >
        <div class="upload-row row" style="gap: 10px; align-items: center">
          <div class="col">
            <FileUpload
              name="source_code"
              mode="basic"
              accept=".zip"
              :auto="false"
              :customUpload="true"
              @select="onSourceCodeSelect"
              :maxFileSize="524288000"
            />
          </div>
        </div>
        <small v-if="validationErrors?.source_code" style="color: red">{{
          validationErrors?.source_code
        }}</small>
      </div>
      <small
        >Link:
        <a
          style="color: blue; text-decoration: underline"
          :href="uploadForm.source_code"
          >{{ uploadForm.source_code }}</a
        ></small
      >
      <!-- <div class="input-container col-5">
        <label for="source_code"
          >Source Code <span><small>(Git Link)</small></span
          ><span style="color: red">*</span></label
        >
        <InputText
          id="source_code"
          v-model="uploadForm.source_code"
          placeholder="GIT HTTPS Only"
        />
        <small v-if="validationErrors?.source_code" style="color: red">{{
          validationErrors?.source_code
        }}</small>
        <div v-if="$route.query.is_edit === 'true'" class="row-5">
          <small
            >Link:
            <a
              style="color: blue; text-decoration: underline"
              :href="uploadForm.source_code"
              >{{ uploadForm.source_code }}</a
            ></small
          >
        </div>
      </div> -->
      <div class="input-container col-5">
        <label for="course">Program <span style="color: red">*</span></label>
        <Select
          v-model="uploadForm.course"
          :options="courses"
          placeholder="Select a Program"
          :disabled="role === 'student'"
        />
        <small v-if="validationErrors?.course" style="color: red">{{
          validationErrors?.course
        }}</small>
      </div>
      <div class="input-container col-5">
        <label for="specialization"
          >Specialization <span style="color: red">*</span></label
        >
        <Select
          v-model="uploadForm.specialization"
          :options="specializations[uploadForm.course]"
          placeholder="Select a Specialization"
          :disabled="role === 'student'"
        />
        <small v-if="validationErrors?.specialization" style="color: red">{{
          validationErrors?.specialization
        }}</small>
      </div>
      <div
        class="wrap"
        style="justify-content: center; align-items: center; gap: 5px"
      >
        <Button
          label="Submit Capstone"
          style="margin-block: 20px; min-width: 310px; max-width: 400px"
          type="submit"
          :loading="isLoading"
        />
        <Button
          label="Cancel"
          severity="secondary"
          @click="this.$router.back"
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
        tags: [],
        source_code: null,
        members: [],
        date_published: null,
        course: null,
        specialization: null,
        academic_year: null,
      },
      academic_years: null,
      courses: ["IT", "CS", "IS"],
      specializations: {
        IT: [
          "Automation",
          "Network and Security",
          "Web and Mobile App Development",
        ],
        IS: ["Business Analytics", "Service Management"],
        CS: ["Core Computer Science", "Game Development", "Data Science"],
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
      role: null,
      max_group_members: null,
    };
  },

  validations: {
    uploadForm: {
      title: { required: true },
      full_document: { required: true },
      acm_paper: { required: true },
      pubmat: { required: true },
      tags: { required: true },
      source_code: { required: true },
      approval_form: { required: true },
      date_published: { required: true },
      course: { required: true },
      specialization: { required: true },
      academic_year: { required: true },
    },
  },

  computed: {},

  methods: {
    generateAcademicYears() {
      const currentYear = new Date().getFullYear();
      const academicYears = [];

      for (let year = 2014; year < currentYear; year++) {
        academicYears.push(`${year}-${year + 1}`);
      }

      this.academic_years = academicYears;
    },

    onFileSelect(event) {
      this.uploadForm.acm_paper = event.files[0];
    },

    onFullPaperFileSelect(event) {
      this.uploadForm.full_document = event.files[0];
    },

    onSourceCodeSelect(event) {
      this.uploadForm.source_code = event.files[0];
    },

    async fetchProject(id) {
      try {
        const response = await capstone.getByID(id);

        // Extract capstone_group_id from the response
        if (response.capstone_group) {
          let groupID = response.capstone_group.id
            ? response.capstone_group.id
            : null;

          this.fetchGroup(groupID);
        }

        // Create a copy of the response without the keyword field
        const filteredResponse = { ...response };

        // Assign other properties to uploadForm
        Object.assign(this.uploadForm, {
          ...filteredResponse,
          tags: filteredResponse.tags,
          members: filteredResponse.members || [],
          date_published: new Date(filteredResponse.date_published),
        });
      } catch (error) {
        console.error(error);
      }
    },

    async fetchGroup(groupID) {
      try {
        const response = await groups.getGroup(groupID);

        const { id, name, group_members, max_members } = response;
        this.selectedGroup = { id, name, group_members, max_members };
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
          max_members: item.max_members,
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

    dynamicMemberCount() {
      if (this.selectedGroup?.max_members) {
        const count = parseInt(this.selectedGroup.max_members) || 0;
        // Extend uploadForm.members array if needed
        while (this.uploadForm.members.length < count) {
          this.uploadForm.members.push("");
        }
        // Trim if there's excess
        this.uploadForm.members = this.uploadForm.members.slice(0, count);
        this.max_group_members = this.uploadForm.members;
      }
    },

    async validateForm() {
      try {
        await Yup.object()
          .shape({
            capstone_group_id: Yup.string().nullable(), // optional
            title: Yup.string().required("Title is required"),
            ip_regristration: Yup.string().nullable(), // optional
            acm_paper: Yup.mixed()
              .required("ACM Paper is required")
              .test(
                "fileTypeOrUrl",
                "ACM Paper must be a PDF file or a valid URL string",
                (value) =>
                  !!value &&
                  ((typeof value === "string" && value.startsWith("http")) || // string URL
                    (value instanceof File && value.type === "application/pdf")) // File object
              ),

            full_document: Yup.mixed()
              .required("Full document is required")
              .test(
                "fileTypeOrUrl",
                "Full document must be a PDF file or a valid URL string",
                (value) =>
                  !!value &&
                  ((typeof value === "string" && value.startsWith("http")) || // string URL
                    (value instanceof File && value.type === "application/pdf")) // File object
              ),
            pubmat: Yup.string().required("Pubmat is required"),
            approval_form: Yup.string().nullable(), // optional
            tags: Yup.array()
              .of(Yup.string().required("Each tag must be a string"))
              .min(1, "At least one tag is required"),
            source_code: Yup.string().required("Source code is required"),
            approval_form: Yup.string().required("Source code is required"),
            date_published: Yup.date().required("Date published is required"),
            course: Yup.string().required("Course is required"),
            specialization: Yup.string().required("Specialization is required"),
            academic_year: Yup.string()
              .required("Academic Year is required")
              .matches(
                /^\d{4}-\d{4}$/,
                "Academic Year must be in the format YYYY-YYYY (No Spaces)"
              ),
          })
          .validate(this.uploadForm, { abortEarly: false });

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

    async uploadCapstone() {
      this.isLoading = true;
      this.uploadForm.members = this.uploadForm.members.filter(
        (name) => name !== ""
      );
      await this.validateForm();
      if (!Object.keys(this.validationErrors).length) {
        this.uploadForm.capstone_group_id = this.selectedGroup
          ? this.selectedGroup.id
          : null;

        this.uploadForm.date_published = this.uploadForm?.date_published
          ? new Date(
              new Date(this.uploadForm.date_published).setDate(
                new Date(this.uploadForm.date_published).getDate() + 1
              )
            )
              .toISOString()
              .split("T")[0]
          : null;
        try {
          if (this.$route.query.is_edit === "true") {
            await capstone.update(
              this.$route.query.project_id,
              this.uploadForm
            );
            this.$router.push("/upload");
          } else {
            await capstone.create(this.uploadForm);
            this.uploadForm = {
              capstone_group_id: null,
              title: null,
              ip_regristration: null,
              acm_paper: null,
              full_document: null,
              pubmat: null,
              tags: [],
              approval_form: null,
              source_code: null,
              members: [],
              date_published: null,
            };
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
            summary: "Upload Error",
            detail: error.response.data,
            life: 3000,
          });
        } finally {
          this.isLoading = false;
        }
      } else {
        this.isLoading = false;
      }
    },
    preventRefresh(event) {
      event.preventDefault();
      event.returnValue = ""; // Required for modern browsers
    },
  },
  async mounted() {
    this.generateAcademicYears();
    this.fetchGroups();
    if (this.$route.query.is_edit === "true") {
      await this.fetchProject(this.$route.query.project_id);
    }
    this.role = localStorage.getItem("role");
    this.uploadForm.course = localStorage.getItem("course");
    this.uploadForm.specialization = localStorage.getItem("specialization");

    if (this.role === "student") {
      this.uploadForm.academic_year = localStorage.getItem("academic_year");
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.preventRefresh);
  },

  watch: {
    isLoading(newValue) {
      if (newValue) {
        window.addEventListener("beforeunload", this.preventRefresh);
      } else {
        window.removeEventListener("beforeunload", this.preventRefresh);
      }
    },

    selectedGroup: {
      handler(newValue) {
        console.log("val", newValue);

        this.uploadForm.members =
          newValue?.group_members?.map((member) => {
            return `${member.first_name} ${member.last_name}`;
          }) || [];
      },
      immediate: true,
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
