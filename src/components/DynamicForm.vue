<template>
  <v-container>
    <v-form v-model="isValid" ref="formRef">
      <!-- {{ errors }} -->
      <div
        v-for="section in sections"
        :key="section.object_id"
        class="mb-6 bg-white"
      >
        <v-expansion-panels :elevation="0" v-if="section.collapsable" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title class="pa-2 ma-0" hide-actions>
              <template v-slot:default="{ expanded }">
                <div class="flex items-center w-full">
                  <!-- آیکون سمت چپ -->
                  <v-icon
                    class="mr-2"
                    v-if="section.label.en === 'Second Section'"
                  >
                    {{ expanded ? "mdi-menu-up" : "mdi-menu-down" }}
                  </v-icon>

                  <!-- عنوان -->
                  <span>{{ section.label.en }}</span>
                </div>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-0 ma-0">
              <!-- {{ section.object_id }} -->
              <SectionFields
                v-if="section.fields && section.fields.length > 0"
                :fields="section.fields || []"
                v-model="getSectionModel(section.object_id).value"
                :errors="props.errors?.[section.object_id] || {}"
                @clear-error="
                  (fieldId) => emit('clear-error', section.object_id, fieldId)
                "
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          <h3 class="text-lg font-semibold mb-4">{{ section.label.en }}</h3>
          <SectionFields
            v-if="section.fields && section.fields.length > 0"
            :fields="section.fields || []"
            v-model="getSectionModel(section.object_id).value"
            :errors="props.errors?.[section.object_id] || {}"
            @clear-error="
              (fieldId) => emit('clear-error', section.object_id, fieldId)
            "
          />
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import SectionFields from "./SectionFields.vue";
import type { Section } from "@/types/form";

const props = defineProps<{
  sections: Section[];
  formValues: Record<string, Record<string, any>>;
  errors?: Record<string, Record<string, string>>;
}>();

const emit = defineEmits<{
  (e: "update:formValues", value: Record<string, Record<string, any>>): void;
  (e: "clear-error", sectionId: string, fieldId: string): void;
}>();

const isValid = ref(false);
const formRef = ref();

function getSectionModel(sectionId: string) {
  return computed({
    get: () => {
      return props.formValues[sectionId] || {};
    },
    set: (sectionData: Record<string, any>) => {
      emit("update:formValues", {
        ...props.formValues,
        [sectionId]: sectionData,
      });
    },
  });
}

// Validate all fields on mount
const validateFields = () => {
  props.sections.forEach((section) => {
    section.fields?.forEach((field) => {
      // Validation logic here
    });
  });
};
</script>


<style >
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}

.__v-expansion-panel-title__icon {
  order: -1; /* فلش را به سمت چپ می‌برد */
  margin-left: 0;
}

.v-expansion-panel-title__icon {
  display: none;
}
</style>