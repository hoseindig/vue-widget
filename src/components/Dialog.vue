<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card class="rounded-xl pa-4 px-1">
      <!-- <p>Dialog</p> -->
      {{ currentStep }}
      <StepBase
        :steps-data="form.steps"
        :active-step="currentStep"
        v-model:activeStepIndex="currentStep"
      />
      <!-- <v-btn @click="currentStep = 1">استپ ۱</v-btn> -->
      <!-- <v-btn @click="currentStep = 2">استپ ۲</v-btn> -->
      <DynamicForm :sections="form.steps[0].sections" v-if="form.steps" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import DynamicForm from "./DynamicForm.vue";
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

const closeDialog = () => {
  dialogModel.value = false;
};
</script>
