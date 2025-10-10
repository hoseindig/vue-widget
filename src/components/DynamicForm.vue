<template>
  <v-container>
    <v-form v-model="isValid" ref="formRef">
      <div v-for="section in sections" :key="section.object_id" class="mb-6">
        <v-expansion-panels :elevation="0" v-if="section.collapsable" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title class="pa-0 ma-0">
              {{ section.label.en }}
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-0 ma-0">
              <SectionFields
                :fields="section.fields || []"
                v-model="getSectionModel(section.object_id).value"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          <h3 class="text-lg font-semibold mb-4">{{ section.label.en }}</h3>
          <SectionFields
            :fields="section.fields || []"
            v-model="getSectionModel(section.object_id).value"
          />
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"; // computed
import type { PropType } from "vue";
import SectionFields from "./SectionFields.vue";
import type { Section } from "@/types/form";

// ... interfaces

const props = defineProps<{
  sections: Section[];
  // 1.   StepBase   v-model:form-values
  formValues: Record<string, Record<string, any>>;
}>();

const emit = defineEmits<{
  // 2. Emit   StepBase
  (e: "update:formValues", value: Record<string, Record<string, any>>): void;
}>();

const isValid = ref(false);
const formRef = ref();

//   computed property
function getSectionModel(sectionId: string) {
  return computed({
    get: () => {
      // def {} val
      return props.formValues[sectionId] || {};
    },
    set: (sectionData: Record<string, any>) => {
      //  update  StepBase data
      emit("update:formValues", {
        ...props.formValues, //
        [sectionId]: sectionData, // update
      });
    },
  });
}
</script>

<style>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
