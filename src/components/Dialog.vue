<template>
  <v-dialog v-model="dialog" max-width="500">
    <!-- <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary"> Open Dialog </v-btn>
    </template> -->

    <v-card class="pa-0">
      <v-card-title>Form Dialog</v-card-title>
      <div style="">
        <v-card-text class="pa-0 ma-0">
          <div style="">
            <CustomStep
              :form-schema="formDataAsFormData"
              :form-data="formDataAsFormData"
              v-model:form-values="formValues"
              v-model:active-step-index="activeStepIndex"
            />
          </div>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormData } from "@/types/form";
import CustomStep from "./CustomStep.vue";

interface Props {
  formData: FormData | FormData[];
}

const props = defineProps<Props>();

// تبدیل به FormData تکی
const formDataAsFormData = computed((): FormData => {
  if (Array.isArray(props.formData)) {
    return props.formData[0] || { steps: [] };
  }
  return props.formData;
});

const dialog = ref(false);
const formValues = ref({});
const activeStepIndex = ref(0);
</script>

<style scoped>
.v-card-text {
  padding: 0;
}
</style>
