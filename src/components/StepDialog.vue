<template>
  <v-dialog v-model="dialogModel" max-width="600" persistent>
    <v-card class="rounded-xl pa-4 px-1">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6 font-weight-medium">New Request</div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider class="my-2" />

      <!-- Stepper -->
      <v-stepper v-model="step" alt-labels class="pb-4">
        <v-stepper-header>
          <v-stepper-item :value="1" title="Request" subtitle="Category" />
          <v-divider />
          <v-stepper-item :value="2" title="Component" subtitle="Category" />
          <v-divider />
          <v-stepper-item :value="3" title="Request" subtitle="Details" />
          <v-divider />
          <v-stepper-item :value="4" title="Attachments" />
          <v-divider />
          <v-stepper-item :value="5" title="Summary" />
        </v-stepper-header>
      </v-stepper>

      <v-card-text class="scroll-y" style="max-height: 60vh">
        <!-- Step 1 -->
        <div v-if="step === 1">
          <v-text-field
            label="Title *"
            v-model="form.title"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            label="Request Category"
            variant="outlined"
            v-model="form.category"
          />
          <v-text-field
            label="Request Template"
            placeholder="Type here to search request template"
            variant="outlined"
          />
          <v-textarea
            label="Description"
            v-model="form.description"
            rows="3"
            auto-grow
            variant="outlined"
            hint="You can enter a maximum of 256 characters"
          />
        </div>

        <!-- Step 2 -->
        <div v-else-if="step === 2">
          <v-text-field
            label="Input Items"
            v-model="form.items"
            variant="outlined"
          />
          <v-text-field
            label="Due Date"
            type="date"
            v-model="form.dueDate"
            variant="outlined"
          />
          <v-text-field
            label="Context Project"
            v-model="form.project"
            variant="outlined"
          />
          <v-text-field
            label="Context Product"
            v-model="form.product"
            variant="outlined"
          />
          <v-text-field
            label="Context Plant"
            v-model="form.plant"
            variant="outlined"
          />
        </div>

        <!-- Step 3 -->
        <div v-else-if="step === 3">
          <v-textarea
            label="Extra Details"
            v-model="form.details"
            variant="outlined"
            rows="4"
          />
        </div>

        <!-- Step 4 -->
        <div v-else-if="step === 4">
          <v-file-input
            label="Attachments"
            v-model="form.files"
            variant="outlined"
            multiple
          />
        </div>

        <!-- Step 5 -->
        <div v-else>
          <p class="text-subtitle-1 mb-3">
            ✅ Review Summary before submission
          </p>
          <v-list density="compact">
            <v-list-item title="Title" :subtitle="form.title" />
            <v-list-item title="Category" :subtitle="form.category" />
            <v-list-item title="Due Date" :subtitle="form.dueDate" />
          </v-list>
        </div>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Footer -->
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" v-if="step > 1" @click="step--">Back</v-btn>
        <v-btn v-if="step < 5" color="primary" @click="step++">Next</v-btn>
        <v-btn v-else color="success" @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  formData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const step = ref(1);

// فرم داخلی محلی (تا در صورت بستن، تغییرات ذخیره‌نشده از بین بره)
const form = ref({
  title: "",
  category: "Component Introduction Request",
  description: "",
  items: "",
  dueDate: "",
  project: "",
  product: "",
  plant: "",
  details: "",
  files: [],
});

// هر بار که prop جدید بیاد، فرم داخلی به‌روز میشه
watch(
  () => props.formData,
  (val) => {
    if (Array.isArray(val)) {
      // مثال: فقط آیتم اول رو میگیریم
      form.value = { ...form.value, ...val[0] };
      console.log("formData (first item):", val[0]);
    } else {
      form.value = { ...form.value, ...val };
      console.log("formData:", JSON.parse(JSON.stringify(val)));
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit("submit", form.value);
  closeDialog();
};

const closeDialog = () => {
  dialogModel.value = false;
  step.value = 1;
};
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}
</style>
