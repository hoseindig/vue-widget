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

/* ارتفاع و استایل اصلی */
.custom-combobox :deep(.v-field__input) {
  min-height: 30px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  font-size: 14px !important;
  color: #333 !important;
  background-color: #fff !important;
}

/* رنگ border عادی */
.custom-combobox :deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-width: 1px;
  border-radius: 5px !important;
  color: #d4d4d4 !important;
}

/* رنگ border در حالت فوکوس */
.custom-combobox :deep(.v-field.v-field--focused .v-field__outline) {
  color: #1976d2 !important;
}

/* placeholder رنگ کم‌رنگ‌تر */
.custom-combobox :deep(input::placeholder) {
  color: #999 !important;
}
</style>
