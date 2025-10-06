<template>
  <v-dialog v-model="dialogModel" max-width="800" persistent>
    <v-card class="rounded-xl pa-4">
      <!-- Header with Stepper -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6 font-weight-medium">New Request</div>
        <v-btn icon="mdi-close" variant="text" @click="dialogModel = false" />
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
            rows="3"
            auto-grow
            variant="outlined"
            hint="You can enter a maximum of 256 characters"
          />
        </div>

        <!-- Step 2 -->
        <div v-else-if="step === 2">
          <v-text-field label="Input Items" variant="outlined" />
          <v-text-field label="Due Date" type="date" variant="outlined" />
          <v-text-field label="Context Project" variant="outlined" />
          <v-text-field label="Context Product" variant="outlined" />
          <v-text-field label="Context Plant" variant="outlined" />
        </div>

        <!-- Step 3 -->
        <div v-else-if="step === 3">
          <v-textarea label="Extra Details" variant="outlined" rows="4" />
        </div>

        <!-- Step 4 -->
        <div v-else-if="step === 4">
          <v-file-input label="Attachments" variant="outlined" multiple />
        </div>

        <!-- Step 5 -->
        <div v-else>
          <p class="text-subtitle-1 mb-3">
            ✅ Review Summary before submission
          </p>
          <v-list density="compact">
            <v-list-item title="Title" :subtitle="form.title" />
            <v-list-item title="Category" :subtitle="form.category" />
          </v-list>
        </div>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Footer -->
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" v-if="step > 1" @click="step--">Back</v-btn>
        <v-btn v-if="step < 5" color="primary" @click="step++"> Next </v-btn>
        <v-btn v-else color="success" @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const step = ref(1);

const form = ref({
  title: "",
  category: "Component Introduction Request",
});

const submitForm = () => {
  console.log("Form submitted:", form.value);
  dialogModel.value = false;
  step.value = 1;
};
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}
</style>
