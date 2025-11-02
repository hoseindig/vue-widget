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

/* 1. کنترل ارتفاع کل فیلد و حذف پدینگ‌های Vuetify */
.custom-combobox :deep(.v-field) {
  /* ارتفاع کل v-field را برای کنترل نهایی اندازه فیلد، محدود می‌کنیم */
  height: 24px !important; /* ارتفاع نهایی شامل border، باید حدود 24px باشد */
  min-height: 24px !important;

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
  padding-right: 2px !important; /* پدینگ سمت راست توسط v-field__field و دکمه مدیریت می‌شود */

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
  /* این flexbox برای ترازبندی عمودی محتوای input (متن و چیپ‌ها) حیاتی است */
  display: flex;
  align-items: center;
}

/* استایل کانتینر آیکن (v-field__append-inner) برای تبدیل شدن به باکس دکمه */
.custom-combobox :deep(.v-field__append-inner) {
  background-color: #f5f5f5 !important;
  border-left: 1px solid #b4b6ba !important;

  /* اعمال پدینگ جدید: 3px بالا/پایین، 6px چپ/راست */
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-left: 3.5px !important;
  padding-right: 3.5px !important;

  height: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-left: 0 !important;
  width: auto !important; /* اجازه می‌دهیم اندازه آن با محتوا و پدینگ تعیین شود */
}

/* شعاع گوشه برای دکمه (بالا راست و پایین راست) */
.custom-combobox :deep(.v-field__append-inner) {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* استایل فلش پایین (mdi-menu-down) */
.custom-combobox :deep(.dropdown-icon) {
  color: #333 !important;
  opacity: 1 !important;
}

/* مخفی کردن آیکن پیش‌فرض Vuetify (مانند آیکون فلش پیش‌فرض) */
.custom-combobox :deep(.v-field__append-inner .v-icon:not(.dropdown-icon)) {
  display: none;
}

/* رنگ border در حالت hover */
.custom-combobox :deep(.v-field:hover) {
  border-color: #888 !important;
}

/* رنگ border در حالت focus */
.custom-combobox :deep(.v-field.v-field--focused) {
  border-color: #1976d2 !important;
}

/* رنگ placeholder */
.custom-combobox :deep(input::placeholder) {
  color: #aaa !important;
}
</style>
