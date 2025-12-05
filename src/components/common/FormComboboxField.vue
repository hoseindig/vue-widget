<template>
  <v-select
    v-model="internalValue"
    :items="normalizedOptions"
    :multiple="selection === 'MULTIPLE'"
    item-title="label"
    item-value="value"
    variant="outlined"
    density="compact"
    hide-details
    class="custom-combobox"
    :class="fieldClasses"
    :chips="selection === 'MULTIPLE'"
    :closable-chips="selection === 'MULTIPLE'"
  >
    <template v-slot:append-inner>
      <v-icon size="30" class="dropdown-icon">mdi-menu-down</v-icon>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps<{
  modelValue: string | string[];
  options: Record<string, string> | string[];
  selection?: "SINGLE" | "MULTIPLE";
  hasError?: boolean; // پروپ خطا
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const internalValue = ref(props.modelValue);

// کلاس‌های CSS شرطی
const fieldClasses = computed(() => ({
  "error-border": props.hasError,
}));

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

.custom-combobox.error-border :deep(.v-field) {
  border: 1px solid #ff0000 !important;
}

.custom-combobox.error-border :deep(.v-field.v-field--focused) {
  border-color: #ff0000 !important;
}

.custom-combobox.error-border :deep(.v-field:hover) {
  border-color: #ff0000 !important;
}

.custom-combobox.error-border :deep(.v-field__append-inner) {
  border-left: 1px solid #ff0000 !important;
}

.custom-combobox :deep(.v-field) {
  height: 24px !important; /* ارتفاع نهایی شامل border، باید حدود 24px باشد */
  min-height: 24px !important;

  border: 1px solid #b4b6ba !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  padding: 0 !important; /* حذف پدینگ‌های سطح Vuetify */
}

.custom-combobox :deep(.v-field__outline) {
  display: none !important;
}

.custom-combobox :deep(.v-field__input) {
  min-height: 20px !important;
  height: 20px !important;
  line-height: 20px !important; /* برای ترازبندی عمودی متن */

  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 5px !important; /* پدینگ سمت چپ برای متن */
  padding-right: 2px !important;

  font-size: 12px !important;
  color: #333 !important;
  background-color: #fff !important;
}

.custom-combobox :deep(.v-field__field) {
  height: 22px !important;
  min-height: 20px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex;
  align-items: center;
}

.custom-combobox :deep(.v-field__append-inner) {
  background-color: #f5f5f5 !important;

  border-left: 1px solid #b4b6ba !important;

  padding-top: 0px !important;
  padding-bottom: 0px !important;

  padding-left: 1px !important;
  padding-right: 1px !important;

  height: 24px !important; /* ارتفاع نهایی دکمه */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-left: 0 !important;
}

.custom-combobox :deep(.dropdown-icon) {
  color: #333 !important;
  opacity: 1 !important;
  /* تنظیم margin منفی برای جابجایی عمودی آیکون بزرگتر */
  margin-top: -3px !important;
  margin-bottom: -3px !important;
}

.custom-combobox :deep(.v-field__append-inner) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.custom-combobox :deep(.v-field__append-inner .v-icon:not(.dropdown-icon)) {
  display: none;
}

.custom-combobox :deep(.v-field:hover) {
  border-color: #888 !important;
}

.custom-combobox :deep(.v-field.v-field--focused) {
  border-color: #1976d2 !important;
}

.custom-combobox :deep(input::placeholder) {
  color: #aaa !important;
}
</style>
