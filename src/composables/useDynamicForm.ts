// composables/useDynamicForm.ts
import { computed } from "vue";
import type { Field } from "@/types/form";
import { formHandlers } from "../utils/formHandlers";

export function useDynamicForm(props: {
  fields: Field[];
  modelValue: Record<string, any>;
}) {
  // ----------------------------
  // Visible Fields
  // ----------------------------
  const visibleFields = computed(() =>
    props.fields.filter(
      (f) =>
        !f.settings?.some(
          (s) => s.key === "hidden" && String(s.value) === "true"
        )
    )
  );

  // ----------------------------
  // Disabled Check
  // ----------------------------
  const isDisabled = (field: Field) =>
    field.settings?.some(
      (s) => s.key === "disabled" && String(s.value) === "true"
    );

  // ----------------------------
  // Field Value Getter
  // ----------------------------
  const getFieldValue = (field: Field): string | string[] => {
    if (field.data && typeof field.data === "object" && "value" in field.data) {
      return field.data.value ?? getDefault(field);
    }
    if (
      typeof field.data === "string" ||
      Array.isArray(field.data)
    ) {
      return field.data;
    }

    if (props.modelValue[field.object_id]) {
      return props.modelValue[field.object_id];
    }

    return getDefault(field);
  };

  function getDefault(field: Field) {
    return field.input?.selection === "MULTIPLE" ||
      field.input?.type === "check_box"
      ? []
      : "";
  }

  // ----------------------------
  // Dynamic Handler Runner
  // ----------------------------
  function runDynamicHandler(
    changedField: Field,
    value: any,
    fields: Field[]
  ) {
    const handlerConfig = changedField.settings?.find(
      (x) => x.key === "OnChangeHandler"
    )?.value;

    if (!handlerConfig || typeof handlerConfig !== "object") return;

    const sections = [
      "fieldsToSetDefaultValue",
      "fieldsToSetEmptyValue",
      "fieldsToRequired",
      "fieldsToUnRequired",
      "fieldsToDisable",
      "fieldsToEnable",
      "fieldsToHidden",
      "fieldsToUnHidden",
    ];

    sections.forEach((section) => {
      const block = handlerConfig[section];
      if (!block) return;

      const methodName = block.condition?.method;
      const params = block.condition?.parameters ?? [];

      const handler = formHandlers[methodName];
      if (!handler) return;

      const ok = handler(value, params);
      if (!ok) return;

      applyAction(section, block.targets, fields);
    });
  }

  // ----------------------------
  // ACTION Helpers
  // ----------------------------
  function applyAction(
    section: string,
    targets: any[],
    fields: Field[]
  ) {
    const actions: any = {
      fieldsToHidden: applyHidden,
      fieldsToUnHidden: removeHidden,
      fieldsToDisable: applyDisable,
      fieldsToEnable: removeDisable,
      fieldsToRequired: applyRequired,
      fieldsToUnRequired: removeRequired,
      fieldsToSetDefaultValue: applyDefaultValue,
      fieldsToSetEmptyValue: applyEmptyValue,
    };

    const fn = actions[section];
    if (fn) fn(targets, fields);
  }

  function applyHidden(targets: any[], fields: Field[]) {
    updateSetting(fields, targets, "hidden", "true");
  }
  function removeHidden(targets: any[], fields: Field[]) {
    removeSetting(fields, targets, "hidden");
  }

  function applyDisable(targets: any[], fields: Field[]) {
    updateSetting(fields, targets, "disabled", "true");
  }
  function removeDisable(targets: any[], fields: Field[]) {
    removeSetting(fields, targets, "disabled");
  }

  function applyRequired(targets: any[], fields: Field[]) {
    debugger
    updateSetting(fields, targets, "required", "true");
  }
  function removeRequired(targets: any[], fields: Field[]) {
    removeSetting(fields, targets, "required");
  }

  function applyDefaultValue(targets: any[], fields: Field[]) {
    targets.forEach((t) => {
      const f = fields.find((x) => x.object_id === t.field);
      if (!f) return;
      if (!f.data) f.data = { value: "" };
      f.data.value = t.value;
    });
  }

  function applyEmptyValue(targets: any[], fields: Field[]) {
    targets.forEach((t) => {
      const f = fields.find((x) => x.object_id === t.field);
      if (!f) return;
      if (!f.data) f.data = { value: "" };
      f.data.value = "";
    });
  }

  function updateSetting(
    fields: Field[],
    targets: any[],
    key: string,
    value: string
  ) {
    targets.forEach((t) => {
      const field = fields.find((f) => f.object_id === t.field);
      if (!field) return;

      if (!field.settings) field.settings = [];

      const existing = field.settings.find((s) => s.key === key);
      if (existing) existing.value = value;
      else field.settings.push({ key, value });
    });
  }

  function removeSetting(
    fields: Field[],
    targets: any[],
    key: string
  ) {
    targets.forEach((t) => {
      const field = fields.find((f) => f.object_id === t.field);
      if (!field || !field.settings) return;

      field.settings = field.settings.filter((s) => s.key !== key);
    });
  }

  return {
    visibleFields,
    isDisabled,
    getFieldValue,
    runDynamicHandler,
  };
}
