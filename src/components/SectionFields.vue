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
      <label for="" class="custom-label">{{ field.label.en }} </label>
      <span style="color: red">{{
        field?.settings?.find((s) => s.key === "required" && s.value === "true")
          ? "*"
          : ""
      }}</span>
      <!-- <span> type : {{ field.input.type }} </span>
      <span v-if="field.input.type === 'date'">
        $$ input : {{ field.input }}$$
      </span> -->
      <!-- <i> selection : {{ field.input?.selection }} </i> -->
      <i>
        selection :
        {{ field.settings?.find((x) => x.key === "OnChangeHandler") }}
      </i>

      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          <!-- format="mm/dd/yyyy" -->
          <CustomDatePicker
            :locale="field.input?.calendar"
            :format="field.input?.format"
            :tooltip="(field.tooltip as any)?.en"
            :placeholder="field.label.en"
            :has-error="!!props.errors?.[field.object_id]"
            v-if="field.input.type === 'date'"
            :model-value="getFieldValue(field) as string"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />

          <FormTextAreaField
            :tooltip="(field.tooltip as any)?.en"
            :placeholder="field.label.en"
            :has-error="!!props.errors?.[field.object_id]"
            v-else-if="field.input.type === 'text_area'"
            :options="field.input.range"
            :selection="field.input.selection"
            :model-value="getFieldValue(field) as string"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <FormComboboxField
            :tooltip="(field.tooltip as any)?.en"
            :placeholder="field.label.en"
            v-else-if="
              field.input.type === 'combobox' &&
              field.input.selection === 'SINGLE'
            "
            :has-error="!!props.errors?.[field.object_id]"
            :options="(field.input.range as Record<string, string> | string[])"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <FormComboboxMultiField
            :tooltip="(field.tooltip as any)?.en"
            :placeholder="field.label.en"
            v-else-if="
              field.input.type === 'combobox' &&
              field.input.selection === 'MULTIPLE'
            "
            :has-error="!!props.errors?.[field.object_id]"
            :options="(field.input.range as Record<string, string> | string[])"
            :selection="field.input.selection"
            :model-value="getFieldValue(field)"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <FormCheckboxField
            :tooltip="(field.tooltip as any)?.en"
            :placeholder="field.label.en"
            :has-error="!!props.errors?.[field.object_id]"
            v-else-if="field.input.type === 'check_box'"
            :options="(field.input.range as Record<string, string>)"
            :selection="field.input.selection"
            :model-value="getFieldValue(field) as string[]"
            @update:model-value="(val) => updateFieldValue(field, val)"
          />
          <FormTextField
            v-else
            :has-error="!!props.errors?.[field.object_id]"
            :model-value="getFieldValue(field) as string"
            :placeholder="field.label.en"
            :tooltip="field.tooltip!.en"
            @update:model-value="(val) => onInput({ target: { value: val } } as any, field)"
          />
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>

      <div v-else>
        <FormComboboxField
          :has-error="!!props.errors?.[field.object_id]"
          v-if="field.input.type === 'combobox'"
          :options="(field.input.range as Record<string, string> | string[])"
          :selection="field.input.selection"
          :model-value="getFieldValue(field)"
          @update:model-value="(val) => updateFieldValue(field, val)"
        />
        <FormCheckboxField
          v-else-if="field.input.type === 'check_box'"
          :has-error="!!props.errors?.[field.object_id]"
          :options="(field.input.range as Record<string, string>)"
          :selection="field.input.selection"
          :model-value="getFieldValue(field) as string[]"
          @update:model-value="(val) => updateFieldValue(field, val)"
        />

        <FormTextField
          v-else
          :has-error="!!props.errors?.[field.object_id]"
          :model-value="getFieldValue(field) as string"
          :placeholder="field.label.en"
          :tooltip="(field.tooltip as any)?.en"
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
import { ref } from "vue";
// import DatePicker from "vue3-persian-datetime-picker";
import type { Field } from "@/types/form";
import FormTextField from "./common/FormTextField.vue";
import FormComboboxField from "./common/FormComboboxField.vue";
import FormCheckboxField from "./common/FormCheckboxField.vue";
import FormComboboxMultiField from "./common/FormComboboxMultiField.vue";
import FormTextAreaField from "./common/FormTextAreaField.vue";
import CustomDatePicker from "./common/CustomDatePicker.vue";

const date = ref("");

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
// نوع خروجی را به string | string[] تغییر می‌دهیم تا با MultiCombobox و Checkbox سازگار شود
const getFieldValue = (field: Field): string | string[] => {
  // اگر field.data یک object است و value دارد
  if (field.data && typeof field.data === "object" && "value" in field.data) {
    return (
      field.data.value ??
      (field.input.selection === "MULTIPLE" || field.input.type === "check_box"
        ? []
        : "")
    );
  }
  // اگر field.data یک string یا string[] است
  if (typeof field.data === "string" || Array.isArray(field.data)) {
    return field.data;
  }
  // اگر در modelValue مقداری ذخیره شده
  if (props.modelValue[field.object_id]) {
    // بازگشت مقدار از modelValue. باید فرض کنیم نوع درست است.
    return props.modelValue[field.object_id];
  }

  // مقدار پیش‌فرض بر اساس نوع فیلد
  return field.input.selection === "MULTIPLE" ||
    field.input.type === "check_box"
    ? []
    : "";
};

const onInput = (event: Event, field: Field) => {
  const value = (event.target as HTMLInputElement).value;
  updateFieldValue(field, value);
  // استفاده از props.errors برای چک کردن مقدار
  if (props.errors && props.errors[field.object_id]) {
    emit("clear-error", field.object_id);
  }
};

// نوع value را به string | string[] تغییر می‌دهیم
const updateFieldValue = (field: Field, value: string | string[]): void => {
  console.log(field, value);

  // اگر field.data یک object نیست، آن را به object تبدیل می‌کنیم
  if (!field.data || typeof field.data !== "object") {
    field.data = { value: "" };
  }

  // مقدار را در field.data.value قرار می‌دهیم
  // اطمینان از اینکه field.data یک آبجکت دارای value است
  if (typeof field.data === "object" && "value" in field.data) {
    field.data.value = value;
  }

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
