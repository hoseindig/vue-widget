<template>
  <v-combobox
    v-model="internalValue"
    :items="normalizedOptions"
    :multiple="selection === 'MULTIPLE'"
    item-title="label"
    item-value="value"
    variant="outlined"
    density="comfortable"
    hide-details
    clearable
    class="custom-combobox"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  modelValue: string | string[];
  options: Record<string, string> | string[]; // پشتیبانی از object و array
  selection?: "SINGLE" | "MULTIPLE";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const internalValue = ref(props.modelValue);

// اگر options به صورت object باشه، اون رو به آرایه قابل فهم برای Vuetify تبدیل می‌کنیم
const normalizedOptions = computed(() => {
  if (Array.isArray(props.options)) return props.options;

  // اگر object بود => تبدیل به [{ value, label }]
  return Object.entries(props.options || {}).map(([value, label]) => ({
    value,
    label,
  }));
});

// همگام‌سازی prop با مدل داخلی
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);

// هر تغییری در مقدار داخلی را به parent اطلاع بده
watch(internalValue, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
.custom-combobox {
  width: 100%;
}
</style>
