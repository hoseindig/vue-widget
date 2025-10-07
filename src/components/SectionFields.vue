<template>
  <v-row dense>
    <v-col v-for="field in fields" :key="field.object_id" cols="12" md="6">
      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props }">
          <v-text-field
            v-bind="props"
            v-model="modelValue[field.object_id]"
            :label="field.label.en"
            variant="outlined"
            hide-details="auto"
          ></v-text-field>
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>

      <v-text-field
        v-else
        v-model="modelValue[field.object_id]"
        :label="field.label.en"
        variant="outlined"
        hide-details="auto"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

interface Field {
  object_id: string;
  label: { en: string; fa: string };
  tooltip?: { en: string; fa: string };
  input: {
    type: string;
  };
}

const props = defineProps<{
  fields: Field[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
}>();
</script>
