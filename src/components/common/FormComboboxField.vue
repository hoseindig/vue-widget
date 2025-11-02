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
    class="custom-combobox"
  >
    <template v-slot:append-inner>
      <v-icon size="24" class="dropdown-icon">mdi-menu-down</v-icon>
    </template>
  </v-combobox>
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
  min-height: 10px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  font-size: 14px !important;
  color: #333 !important;
  background-color: #fff !important;
  padding-right: 16px !important; /* فضای داخلی سمت راست برای دکمه */
}

/* استایل Border کلی و گوشه‌ها برای خود v-field */
.custom-combobox :deep(.v-field) {
  border: 1px solid #b4b6ba !important; /* Border کلی با رنگ جدید */
  border-radius: 6px !important; /* شعاع گوشه‌ها */
  overflow: hidden !important; /* برای اینکه دکمه در داخل گوشه‌ها قرار بگیرد */
  padding-right: 0 !important; /* حذف padding داخلی Vuetify */
}

/* مخفی کردن Outline پیش‌فرض Vuetify */
.custom-combobox :deep(.v-field__outline) {
  display: none !important;
}

/* رنگ border در حالت hover */
.custom-combobox :deep(.v-field:hover) {
  border-color: #888 !important; /* تغییر رنگ Border در حالت hover */
}

/* رنگ border در حالت focus */
.custom-combobox :deep(.v-field.v-field--focused) {
  border-color: #1976d2 !important; /* تغییر رنگ Border در حالت focus */
}

/* رنگ placeholder */
.custom-combobox :deep(input::placeholder) {
  color: #aaa !important;
}

/* استایل کانتینر آیکن (v-field__append-inner) برای تبدیل شدن به باکس دکمه */
.custom-combobox :deep(.v-field__append-inner) {
  background-color: #f5f5f5 !important; /* پس‌زمینه خاکستری روشن */
  border-left: 1px solid #b4b6ba !important; /* خط جداکننده عمودی با رنگ جدید */
  padding-left: 8px !important;
  padding-right: 8px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-left: 0 !important; /* حذف margin سمت چپ پیش‌فرض */
}

/* شعاع گوشه برای دکمه (بالا راست و پایین راست) */
.custom-combobox :deep(.v-field__append-inner) {
  border-top-right-radius: 5px; /* کمی کمتر از 6px کلی */
  border-bottom-right-radius: 5px; /* کمی کمتر از 6px کلی */
}

/* استایل فلش پایین (mdi-menu-down) */
.custom-combobox :deep(.dropdown-icon) {
  color: #333 !important; /* رنگ تیره برای آیکن */
  opacity: 1 !important;
}

/* مخفی کردن آیکن پیش‌فرض Vuetify */
.custom-combobox :deep(.v-field__append-inner .v-icon:not(.dropdown-icon)) {
  display: none;
}
</style>
