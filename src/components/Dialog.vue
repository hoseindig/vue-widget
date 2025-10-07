<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card class="rounded-xl">
      <StepBase
        :form-data="form"
        :active-step="currentStep"
        v-model:activeStepIndex="currentStep"
      />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
// import DynamicForm from "./DynamicForm.vue";
import StepBase from "./StepBase.vue";

const currentStep = ref(1);

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

const form = ref<any>({});

watch(
  () => props.formData,
  (val) => {
    if (Array.isArray(val)) {
      form.value = { ...form.value, ...val[0] };
      console.log("formData (first item):", val[0]);
    } else {
      form.value = { ...form.value, ...val };
      console.log("Dialog formData:", JSON.parse(JSON.stringify(val)));
    }
  },
  { immediate: true }
);
</script>
