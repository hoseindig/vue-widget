<template>
  <v-row dense>
    <v-col
      v-for="field in fields"
      :key="field.object_id"
      cols="12"
      md="12"
      style="text-align: left; margin-bottom: 10px"
      class="pa-0"
    >
      <!-- {{ field.input }} -->
      <label for="" class="custom-label">{{ field.label.en }} </label>
      <span style="color: red">{{
        field?.settings?.find((s) => s.key === "required" && s.value === "true")
          ? "*"
          : ""
      }}</span>
      <!-- {{ field.input.range }} -->
      <span> type : {{ field.input.type }} </span>
      <!-- <span> selection : {{ field.input.selection }}</span> -->
      <i> selection : {{ field.input?.selection }} </i>

      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          <!-- TextArea -->
          <FormTextAreaField
            :has-error="!!errors[field.object_id]"
            v-if="field.input.type === 'text_area'"
            :options="field.input.range"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <!-- Combobox SINGLE -->
          <FormComboboxField
            v-else-if="
              field.input.type === 'combobox' &&
              field.input.selection === 'SINGLE'
            "
            :has-error="!!errors[field.object_id]"
            :options="field.input.range"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <!-- Combobox Multi -->
          <FormComboboxMultiField
            v-else-if="
              field.input.type === 'combobox' &&
              field.input.selection === 'MULTIPLE'
            "
            :has-error="!!errors[field.object_id]"
            :options="field.input.range"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <!-- Checkbox -->
          <FormCheckboxField
            :has-error="!!errors[field.object_id]"
            v-else-if="field.input.type === 'check_box'"
            :options="field.input.range"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <!-- TextField -->
          <FormTextField
            v-else
            :has-error="!!errors[field.object_id]"
            :model-value="getFieldValue(field)"
            :placeholder="field.label.en"
            :tooltip="field.tooltip?.en"
            @update:model-value="(val) => onInput({ target: { value: val } } as any, field)"
          />
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>

      <div v-else>
        <FormComboboxField
          :has-error="!!errors[field.object_id]"
          v-if="field.input.type === 'combobox'"
          :options="field.input.range"
          :selection="field.input.selection"
          :model-value="getFieldValue(field)"
          @update:model-value="(val) => updateFieldValue(field, val)"
        />
        <FormCheckboxField
          v-else-if="field.input.type === 'check_box'"
          :has-error="!!errors[field.object_id]"
          :options="field.input.range"
          :selection="field.input.selection"
          :model-value="getFieldValue(field)"
          @update:model-value="(val) => updateFieldValue(field, val)"
        />
        <FormTextField
          v-else
          :has-error="!!errors[field.object_id]"
          :model-value="getFieldValue(field)"
          :placeholder="field.label.en"
          :tooltip="field.tooltip?.en"
          @update:model-value="(val) => onInput({ target: { value: val } } as any, field)"
        />
      </div>
      <div
        v-if="props.errors && props.errors[field.object_id]"
        class="error-text"
      >
        {{ props.errors[field.object_id] }}
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Field } from "@/types/form";
import FormTextField from "./common/FormTextField.vue";
import FormSelectField from "./common/FormSelectField.vue";
import FormComboboxField from "./common/FormComboboxField.vue";
import FormCheckboxField from "./common/FormCheckboxField.vue";
import FormComboboxMultiField from "./common/FormComboboxMultiField.vue";
import FormTextAreaField from "./common/FormTextAreaField.vue";

const props = defineProps<{
  fields: Field[];
  modelValue: Record<string, any>;
  errors?: Record<string, string>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
  (e: "clear-error", fieldId: string): void;
}>();

// مقدار فعلی field را برمی‌گرداند
const getFieldValue = (field: Field): string => {
  // اگر field.data یک object است و value دارد
  if (field.data && typeof field.data === "object" && "value" in field.data) {
    return field.data.value ?? "";
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

const onInput = (event: Event, field: Field) => {
  const value = (event.target as HTMLInputElement).value;
  updateFieldValue(field, value);
  // اگر اروری برای این فیلد وجود داشت، درخواست پاک‌سازی بده
  if (props.errors && props.errors[field.object_id]) {
    emit("clear-error", field.object_id);
  }
};

// مقدار field را آپدیت می‌کند
const updateFieldValue = (field: Field, value: string): void => {
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
  height: 24px;
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
  font-size: 12px;
  font-weight: bold;
  color: #3d3d3d;
  font-weight: bold;
  word-break: break-word;
  overflow-wrap: break-word;
  text-rendering: optimizeSpeed;
}

.error-text {
  color: #ea4f37;
  font-size: 12px;
  margin-top: 6px;
  font-weight: 500;
}
</style>
