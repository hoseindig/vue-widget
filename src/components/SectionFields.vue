// D:\project\vue\vue-widget\src\components\SectionFields.vue

<template>
  <v-row dense>
    <v-col
      v-for="field in fields"
      :key="field.object_id"
      cols="12"
      md="12"
      style="text-align: left"
    >
      <label for="" class="custom-label">{{ field.label.en }} </label>
      <span style="color: red">{{
        field?.settings?.find((s) => s.key === "required" && s.value === "true")
          ? " *"
          : ""
      }}</span>

      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          {{ field.data }}
          <input
            type="text"
            v-bind="tooltipProps"
            v-model="field.data.value"
            @input="updateFieldValue(field.object_id, $event.target.value)"
            class="custom-height mt-1"
          />
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>

      <div v-else>
        <input
          type="text"
          v-model="field.data.value"
          @input="updateFieldValue(field.object_id, $event.target.value)"
          class="custom-height"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Field } from "@/types/form";

const props = defineProps<{
  fields: Field[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
}>();

const updateFieldValue = (fieldId: string, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [fieldId]: value,
  });
};
</script>

<style scoped>
.custom-height {
  height: 30px;
  width: 100%;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  padding: 5px;
}
.custom-height .v-field__input {
  padding-top: 2px;
  padding-bottom: 2px;
}

.custom-label {
  font-size: 14px;
  font-weight: bold;
}
</style>
