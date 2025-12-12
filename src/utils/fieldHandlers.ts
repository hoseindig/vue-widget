import type { Field } from "@/types/form";
import { formHandlers } from "../utils/formHandlers";

export function applySetDefaultValue(
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

export function applyRequired(targets: { field: string }[], fields: Field[]) {
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

export function removeRequired(targets: { field: string }[], fields: Field[]) {
    targets.forEach((t) => {
        const targetField = fields.find((f) => f.object_id === t.field);
        if (!targetField || !targetField.settings) return;

        targetField.settings = targetField.settings.filter(
            (s) => s.key !== "required"
        );
    });
}

export function applySetEmptyValue(targets: { field: string }[], fields: Field[]) {
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

export function applyHidden(targets: { field: string }[], fields: Field[]) {
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

export function removeHidden(targets: { field: string }[], fields: Field[]) {
    targets.forEach((t) => {
        const targetField = fields.find((f) => f.object_id === t.field);
        if (!targetField || !targetField.settings) return;

        targetField.settings = targetField.settings.filter(
            (s) => s.key !== "hidden"
        );
    });
}

export function applyDisable(targets: { field: string }[], fields: Field[]) {
    targets.forEach((t) => {
        const targetField = fields.find((f) => f.object_id === t.field);
        if (!targetField) return;

        if (!targetField.settings) targetField.settings = [];

        const existing = targetField.settings.find((s) => s.key === "disabled");
        if (existing) {
            existing.value = "true";
        } else {
            targetField.settings.push({ key: "disabled", value: "true" });
        }
    });
}

export function removeDisable(targets: { field: string }[], fields: Field[]) {
    targets.forEach((t) => {
        const targetField = fields.find((f) => f.object_id === t.field);
        if (!targetField || !targetField.settings) return;

        targetField.settings = targetField.settings.filter(
            (s) => s.key !== "disabled"
        );
    });
}

export function runDynamicHandler(changedField: Field, value: any, fields: Field[]) {
    const handlerConfig = changedField.settings?.find(
        (x) => x.key === "OnChangeHandler"
    )?.value;

    if (!handlerConfig) return;

    if (typeof handlerConfig !== "object") return;

    const sections = [
        "fieldsToSetDefaultValue",
        "fieldsToSetEmptyValue",
        "fieldsToRequired",
        "fieldsToUnRequired",
        "fieldsToDisable",
        "fieldsToHidden",
        "fieldsToUnHidden",
        "fieldsToEnable",
        "fieldsToEnable",
        "fieldsToDisable",
        "customMethod",
    ];

    sections.forEach((section) => {
        const block = handlerConfig[section];
        if (!block) return;

        const methodName = block.condition?.method;
        const parameters = block.condition?.parameters ?? [];

        const handlerMethod = formHandlers[methodName];
        if (!handlerMethod) {
            console.warn(`Handler method not found: ${methodName}`);
            return;
        }

        const conditionResult = handlerMethod(
            value.value ? value.value : value,
            parameters
        );

        if (!conditionResult) return;

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

            case "fieldsToDisable":
                applyDisable(block.targets, fields);
                break;

            case "fieldsToEnable":
                removeDisable(block.targets, fields);
                break;

            case "customMethod":
                console.log("running custom method on:", block.fields);
                break;
        }
    });
}