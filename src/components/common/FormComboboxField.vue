<template>
  <!-- استفاده از fieldClasses برای اعمال استایل شرطی -->
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
    :class="fieldClasses"
  >
    <template v-slot:append-inner>
      <v-icon size="30" class="dropdown-icon">mdi-menu-down</v-icon>
    </template>
  </v-combobox>
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

/* ------------------------------------------- */
/* 4. استایل خطا (Error Styling) */
/* ------------------------------------------- */

/* استایل Border قرمز در صورت وجود کلاس error-border */
.custom-combobox.error-border :deep(.v-field) {
  border: 1px solid #ff0000 !important;
}

/* رنگ Border قرمز در حالت Focus هنگام خطا */
.custom-combobox.error-border :deep(.v-field.v-field--focused) {
  border-color: #ff0000 !important;
}

/* رنگ Border قرمز در حالت Hover هنگام خطا */
.custom-combobox.error-border :deep(.v-field:hover) {
  border-color: #ff0000 !important;
}

/* خط سمت چپ دکمه در هنگام خطا */
.custom-combobox.error-border :deep(.v-field__append-inner) {
  border-left: 1px solid #ff0000 !important;
}

/* ------------------------------------------- */
/* استایل‌های عمومی (باقی استایل‌ها) */
/* ------------------------------------------- */

/* 1. کنترل ارتفاع کل فیلد و حذف پدینگ‌های Vuetify */
.custom-combobox :deep(.v-field) {
  /* ارتفاع کل v-field را برای کنترل نهایی اندازه فیلد، محدود می‌کنیم */
  height: 24px !important; /* ارتفاع نهایی شامل border، باید حدود 24px باشد */
  min-height: 24px !important;

  /* Border پیش‌فرض اگر خطا وجود نداشته باشد */
  border: 1px solid #b4b6ba !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  padding: 0 !important; /* حذف پدینگ‌های سطح Vuetify */
}

/* مخفی کردن Outline پیش‌فرض Vuetify */
.custom-combobox :deep(.v-field__outline) {
  display: none !important;
}

/* 2. کنترل ارتفاع باکس ورودی متن */
.custom-combobox :deep(.v-field__input) {
  /* تنظیم ارتفاع نهایی باکس ورودی */
  min-height: 20px !important;
  height: 20px !important;
  line-height: 20px !important; /* برای ترازبندی عمودی متن */

  /* پدینگ داخلی برای ورودی متن */
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 5px !important; /* پدینگ سمت چپ برای متن */
  padding-right: 2px !important;

  font-size: 12px !important;
  color: #333 !important;
  background-color: #fff !important;
}

/* 3. کنترل فضای اطراف input برای ترازبندی */
.custom-combobox :deep(.v-field__field) {
  height: 22px !important;
  min-height: 20px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex;
  align-items: center;
}

/* استایل کانتینر آیکن (v-field__append-inner) برای سازگاری با آیکون 30px در ارتفاع 24px */
.custom-combobox :deep(.v-field__append-inner) {
  background-color: #f5f5f5 !important;

  /* Border پیش‌فرض اگر خطا وجود نداشته باشد */
  border-left: 1px solid #b4b6ba !important;

  /* حذف کامل پدینگ عمودی برای جا دادن آیکون 30px در ارتفاع 24px */
  padding-top: 0px !important;
  padding-bottom: 0px !important;

  /* تنظیم پدینگ افقی برای کنترل عرض */
  padding-left: 1px !important;
  padding-right: 1px !important;

  height: 24px !important; /* ارتفاع نهایی دکمه */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-left: 0 !important;
}

/* کنترل ابعاد داخلی آیکون */
.custom-combobox :deep(.dropdown-icon) {
  color: #333 !important;
  opacity: 1 !important;
  /* تنظیم margin منفی برای جابجایی عمودی آیکون بزرگتر */
  margin-top: -3px !important;
  margin-bottom: -3px !important;
}

/* شعاع گوشه برای دکمه (بالا راست و پایین راست) */
.custom-combobox :deep(.v-field__append-inner) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* مخفی کردن آیکن پیش‌فرض Vuetify (مانند آیکون فلش پیش‌فرض) */
.custom-combobox :deep(.v-field__append-inner .v-icon:not(.dropdown-icon)) {
  display: none;
}

/* رنگ border در حالت hover */
.custom-combobox :deep(.v-field:hover) {
  border-color: #888 !important;
}

/* رنگ border در حالت focus (اگر خطا نباشد) */
.custom-combobox :deep(.v-field.v-field--focused) {
  border-color: #1976d2 !important;
}

/* رنگ placeholder */
.custom-combobox :deep(input::placeholder) {
  color: #aaa !important;
}
</style>
