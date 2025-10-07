// D:\project\vue\vue-widget\src\components\SectionFields.vue

<template>
  <v-row dense>
    <v-col v-for="field in fields" :key="field.object_id" cols="12" md="6">
      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          <v-text-field
            v-bind="tooltipProps"
            v-model="fieldModel[field.object_id]"
            :label="field.label.en"
            variant="outlined"
            hide-details="auto"
          ></v-text-field>
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>
      <v-text-field
        v-else
        v-model="fieldModel[field.object_id]"
        :label="field.label.en"
        variant="outlined"
        hide-details="auto"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue"; // <-- computed را ایمپورت کنید

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

// یک computed property ایجاد کنید تا v-model کار کند
const fieldModel = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    // هنگام تغییر، update:modelValue را emit کنید
    emit("update:modelValue", newValue);
  },
});
</script>
