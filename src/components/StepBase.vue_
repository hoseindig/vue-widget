<template>
  <div>
    <v-stepper
      v-model="stepModel"
      :items="stepLabels"
      show-actions
      editable
      elevation="0"
    >
      <template
        v-for="(item, index) in (Array.isArray(formSchema)
          ? formSchema[0]
          : formSchema
        ).steps"
        :key="index"
      >
        <div class="text-center">
          <!-- <h3 v-if="index + 1 == stepModel">
            index {{ index + 1 }} step {{ stepModel }}- {{ item.label.en }}
          </h3> -->
          <DynamicForm
            :sections="item.sections"
            v-model:form-values="formValuesModel"
            v-if="index + 1 == stepModel"
          />
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormData, Step } from "@/types/form";
import DynamicForm from "./DynamicForm.vue";

const props = defineProps<{
  // 1. formSchema:   (SCHEMA)
  formSchema: FormData | FormData[];
  // 2. formValues:   (DATA -   v-model:form-values   Dialog.vue)
  formValues: any;
  // 3. activeStepIndex:   (  v-model:activeStepIndex)
  activeStepIndex: number;
}>();

const emit = defineEmits<{
  (e: "update:formValues", value: any): void; // emit  Dialog.vue
  (e: "update:activeStepIndex", value: number): void;
}>();

// computed property   v-model:activeStepIndex
const stepModel = computed({
  get: () => props.activeStepIndex,
  set: (value) => {
    emit("update:activeStepIndex", value);
  },
});

// computed property   v-model:form-values
const formValuesModel = computed({
  get: () => props.formValues,
  set: (value) => {
    emit("update:formValues", value);
  },
});

const stepLabels = computed(() => {
  //   formSchema   Labels
  const schema = Array.isArray(props.formSchema)
    ? props.formSchema[0]
    : props.formSchema;
  // return schema.steps.map((item) => item.label.en);
  return schema.steps?.map((item: Step) => item.label.en);
});
</script>
