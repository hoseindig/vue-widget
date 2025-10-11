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
          <input
            type="text"
            v-bind="tooltipProps"
            :value="getFieldValue(field)"
            @input="updateFieldValue(field, $event.target.value)"
            class="custom-height mt-1"
          />
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>

      <div v-else>
        <input
          type="text"
          :value="getFieldValue(field)"
          @input="updateFieldValue(field, $event.target.value)"
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

// مقدار فعلی field را برمی‌گرداند
const getFieldValue = (field: Field) => {
  // اگر field.data یک object است و value دارد
  if (field.data && typeof field.data === "object" && "value" in field.data) {
    return field.data.value;
  }
  // اگر field.data یک string است
  if (typeof field.data === "string") {
    return field.data;
  }
  // اگر در modelValue مقداری ذخیره شده
  if (props.modelValue[field.object_id]) {
    return props.modelValue[field.object_id];
  }
  return "";
};

// مقدار field را آپدیت می‌کند
const updateFieldValue = (field: Field, value: any) => {
  // اگر field.data یک object نیست، آن را به object تبدیل می‌کنیم
  if (!field.data || typeof field.data !== "object") {
    field.data = { value: "" };
  }

  // مقدار را در field.data.value قرار می‌دهیم
  field.data.value = value;

  // و به parent emit می‌کنیم
  emit("update:modelValue", {
    ...props.modelValue,
    [field.object_id]: value,
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
