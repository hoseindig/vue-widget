<template>
  <v-row dense>
    <v-col
      v-for="field in visibleFields"
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
        <!-- <p>field value {{ getFieldValue(field) }}</p> -->
        <p>field.settings {{ field.settings }}</p>
        <!-- <b>OnChangeHandler :</b>
        {{ field.settings?.find((x) => x.key === "OnChangeHandler")?.value }} -->
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
import { computed, ref } from "vue";
import { formHandlers } from "../utils/formHandlers";
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

const visibleFields = computed(() =>
  props.fields.filter(
    (f) => !f.settings?.some((s) => s.key === "hidden" && s.value === "true")
  )
);
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
// ////////////////////////////////
function applySetDefaultValue(
  targets: { field: string; value: any }[],
  fields: Field[]
) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField) return;

    if (!targetField.data) targetField.data = { value: "" };
    targetField.data.value = t.value;
  });
}

function applyRequired(targets: { field: string }[], fields: Field[]) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField) return;

    if (!targetField.settings) targetField.settings = [];

    const existing = targetField.settings.find((s) => s.key === "required");
    if (existing) {
      existing.value = "true";
    } else {
      targetField.settings.push({ key: "required", value: "true" });
    }
  });
}

function removeRequired(targets: { field: string }[], fields: Field[]) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField || !targetField.settings) return;

    // حذف تمام تنظیمات با key = "required"
    targetField.settings = targetField.settings.filter(
      (s) => s.key !== "required"
    );
  });
}

function applySetEmptyValue(targets: { field: string }[], fields: Field[]) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField) return;

    if (!targetField.data) {
      targetField.data = { value: "" };
    } else {
      targetField.data.value = "";
    }
  });
}

function runDynamicHandler(changedField: Field, value: any, fields: Field[]) {
  const handlerConfig = changedField.settings?.find(
    (x) => x.key === "OnChangeHandler"
  )?.value;

  if (!handlerConfig) return;

  // اگر ساختار handlerConfig درست نبود
  if (typeof handlerConfig !== "object") return;

  // تمام سکشن‌ها را یکجا حلقه بزنیم
  const sections = [
    "fieldsToSetDefaultValue",
    "fieldsToSetEmptyValue",
    "fieldsToRequired",
    "fieldsToUnRequired",
    "fieldsToDisable",
    "fieldsToHidden",
    "fieldsToUnHidden",
    "fieldsToEnable",
    "customMethod",
  ];

  sections.forEach((section) => {
    const block = handlerConfig[section];
    if (!block) return;

    const methodName = block.condition?.method;
    const parameters = block.condition?.parameters ?? [];

    // چک کنیم که این متد در فایل ما وجود دارد
    const handlerMethod = formHandlers[methodName];
    if (!handlerMethod) {
      console.warn(`Handler method not found: ${methodName}`);
      return;
    }

    // اجرای متد
    const conditionResult = handlerMethod(
      value.value ? value.value : value,
      parameters
    );

    if (!conditionResult) return;

    // اجرای action روی target ها
    switch (section) {
      case "fieldsToSetDefaultValue":
        applySetDefaultValue(block.targets, fields);
        break;

      case "fieldsToSetEmptyValue":
        applySetEmptyValue(block.targets, fields);
        break;

      case "fieldsToRequired":
        applyRequired(block.targets, fields);
        break;

      case "fieldsToUnRequired":
        removeRequired(block.targets, fields);
        break;

      case "fieldsToHidden":
        applyHidden(block.targets, fields);
        break;

      case "fieldsToUnHidden":
        removeHidden(block.targets, fields);
        break;

      case "customMethod":
        console.log("running custom method on:", block.fields);
        break;
    }
  });
}

function applyHidden(targets: { field: string }[], fields: Field[]) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField) return;

    if (!targetField.settings) targetField.settings = [];

    const existing = targetField.settings.find((s) => s.key === "hidden");
    if (existing) {
      existing.value = "true";
    } else {
      targetField.settings.push({ key: "hidden", value: "true" });
    }
  });
}

function removeHidden(targets: { field: string }[], fields: Field[]) {
  targets.forEach((t) => {
    const targetField = fields.find((f) => f.object_id === t.field);
    if (!targetField || !targetField.settings) return;

    targetField.settings = targetField.settings.filter(
      (s) => s.key !== "hidden"
    );
  });
}

// ////////////////////////////////

const onInput = (event: Event, field: Field) => {
  const value = (event.target as HTMLInputElement).value;
  updateFieldValue(field, value);
  // اجرای Handler
  runDynamicHandler(field, value, props.fields);
  // استفاده از props.errors برای چک کردن مقدار
  if (props.errors && props.errors[field.object_id]) {
    emit("clear-error", field.object_id);
  }
};

// نوع value را به string | string[] تغییر می‌دهیم
const updateFieldValue = (field: Field, value: string | string[]): void => {
  console.log(field, value);
  // اجرای Handler
  runDynamicHandler(field, value, props.fields);

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
