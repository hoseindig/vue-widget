<template>
  <v-dialog v-model="dialogModel" max-width="600" elevation="0">
    <v-card class="rounded-xl">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between py-3 px-4">
        <span class="text-h6 font-weight-medium">Form</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="dialogModel = false"
        />
      </v-card-title>

      <v-divider />

      <!-- Body -->
      <v-card-text class="pa-0">
        <!-- {{ form }} -->
        <!-- <StepBase
          :form-schema="props.formData"
          v-model:form-values="form"
          v-model:activeStepIndex="currentStep"
        /> -->
        <!-- {{ props.formData }} -->
        <!-- <div style="border: 1px solid red"> -->
        <CustomStep
          :form-schema="props.formData"
          v-model:form-values="form"
          v-model:form-data="props.formData"
          v-model:activeStepIndex="currentStep"
        />
        <!-- </div> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import CustomStep from "./CustomStep.vue";
// import StepBase from "./StepBase.vue";

const currentStep = ref(0);

const props = defineProps<{
  modelValue: boolean;
  formData: FormData | FormData[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", value: any): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const form = ref<Record<string, Record<string, any>>>({});

function initializeFormData(schema: any) {
  const initialData: Record<string, Record<string, any>> = {};
  const steps = Array.isArray(schema) ? schema[0].steps : schema.steps;

  if (steps) {
    steps.forEach((step: any) => {
      step.sections?.forEach((section: any) => {
        initialData[section.object_id] = {};
        section.fields?.forEach((field: any) => {
          initialData[section.object_id][field.object_id] = "";
        });
      });
    });
  }
  return initialData;
}

watch(
  () => props.formData,
  (val) => {
    if (val) {
      form.value = initializeFormData(val);
      console.log("Form Data Initialized:", JSON.parse(JSON.stringify(val)));
    }
  },
  { immediate: true }
);
</script>
