<template>
  <v-combobox
    v-model="internalValue"
    :items="normalizedOptions"
    :multiple="selection === 'MULTIPLE'"
    item-title="label"
    item-value="value"
    variant="outlined"
    density="compact"
    hide-details
    clearable
    class="custom-combobox"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  modelValue: string | string[];
  options: Record<string, string> | string[];
  selection?: "SINGLE" | "MULTIPLE";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const internalValue = ref(props.modelValue);

const normalizedOptions = computed(() => {
  if (Array.isArray(props.options)) return props.options;
  return Object.entries(props.options || {}).map(([value, label]) => ({
    value,
    label,
  }));
});

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);

watch(internalValue, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
.custom-combobox {
  width: 100%;
}

/* ارتفاع فیلد */
.custom-combobox :deep(.v-field__input) {
  min-height: 24px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  font-size: 14px !important;
  color: #333 !important;
  background-color: #fff !important;
}

/* ✅ رنگ border در حالت عادی */
.custom-combobox :deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-color: #ff0000 !important;
  --v-field-border-width: 1px;
  border-radius: 6px;
}

/* ✅ رنگ border در حالت hover */
.custom-combobox :deep(.v-field--variant-outlined:hover .v-field__outline) {
  --v-field-border-color: #888;
}

/* ✅ رنگ border در حالت focus */
.custom-combobox :deep(.v-field.v-field--focused .v-field__outline) {
  --v-field-border-color: #1976d2;
}

/* رنگ placeholder */
.custom-combobox :deep(input::placeholder) {
  color: #aaa !important;
}
</style>
