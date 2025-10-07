<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card class="rounded-xl">
      <StepBase
        :form-schema="props.formData"
        v-model:form-values="form"
        v-model:activeStepIndex="currentStep"
      />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import StepBase from "./StepBase.vue";

const currentStep = ref(1);

const props = defineProps<{
  modelValue: boolean;
  formData: FormData | FormData[]; //   schema
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", value: any): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

//   ref
const form = ref<Record<string, Record<string, any>>>({});

// helper Schema
function initializeFormData(schema: any) {
  const initialData: Record<string, Record<string, any>> = {};
  const steps = Array.isArray(schema) ? schema[0].steps : schema.steps;

  if (steps) {
    steps.forEach((step: any) => {
      if (step.sections) {
        step.sections.forEach((section: any) => {
          initialData[section.object_id] = {};
          section.fields.forEach((field: any) => {
            // def value
            initialData[section.object_id][field.object_id] = "";
          });
        });
      }
    });
  }
  return initialData;
}

watch(
  () => props.formData,
  (val) => {
    if (val) {
      //
      form.value = initializeFormData(val);
      console.log(
        "Form Data Initialized:",
        JSON.parse(JSON.stringify(form.value))
      );
    }
  },
  { immediate: true }
);
</script>
