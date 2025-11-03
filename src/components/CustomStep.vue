<template>
  <div class="stepper-container">
    <div
      :class="['stepper-wrapper px-4 pb-15', stepperWrapperClass]"
      v-if="steps.length > 1"
    >
      <template v-for="(step, index) in steps" :key="step.object_id || step.id">
        <div class="step-item">
          <button
            @click="handleStepClick(step.id)"
            :class="[
              'step-circle',
              {
                active: step.id === activeStepModel,
                completed: step.id < activeStepModel,
                inactive: step.id > activeStepModel,
              },
            ]"
            :style="{
              width: `${props.circleSize}px`,
              height: `${props.circleSize}px`,
            }"
            :title="step.tooltip"
          >
            <v-icon :icon="step.icon" :size="props.iconSize" />
          </button>

          <div class="step-label">
            <p
              :class="[
                'label-text',
                {
                  'label-active': step.id === activeStepModel,
                  'label-completed': step.id < activeStepModel,
                  'label-inactive': step.id > activeStepModel,
                },
              ]"
            >
              {{ step.label }}
            </p>
          </div>
        </div>

        <div v-if="index < steps.length - 1" class="connector-line">
          <div
            :class="['line', { 'line-completed': step.id < activeStepModel }]"
            :style="{ height: `${props.lineThickness}px` }"
          />
        </div>
      </template>
    </div>

    <div class="step-content bg-white">
      <DynamicForm
        v-if="currentSections && currentSections.length > 0"
        :sections="currentSections"
        v-model:form-values="formValuesModel"
        :errors="errors"
        @clear-error="clearError"
      />
    </div>

    <div class="controls">
      <v-btn
        @click="goToPreviousStep"
        :disabled="activeStepModel === 0"
        variant="outlined"
        style="
          background-color: #42a2da;
          color: white;
          font-size: 12px;
          text-transform: none;
        "
      >
        Back
      </v-btn>
      <v-btn
        @click="goToNextStep"
        :disabled="activeStepModel === (steps?.length || 1) - 1"
        style="
          background-color: #42a2da;
          color: white;
          font-size: 12px;
          text-transform: none;
        "
      >
        Next
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// در قسمت script
import { computed, ref } from "vue";
import type { FormData, Step } from "@/types/form";
import DynamicForm from "./DynamicForm.vue";
import * as validators from "../utils/validators";

const emit = defineEmits<{
  (e: "update:formValues", value: any): void;
  (e: "update:activeStepIndex", value: number): void;
}>();

interface Props {
  circleSize?: number;
  lineThickness?: number;
  iconSize?: number;
  formSchema: FormData | FormData[];
  formData: FormData;
  formValues: any;
  activeStepIndex: number;
}

const errors = ref<Record<string, Record<string, string>>>({});
const validatedSteps = ref<number[]>([]);

const validationStatus = ref<Record<string, boolean | null>>({});

const props = withDefaults(defineProps<Props>(), {
  circleSize: 40,
  lineThickness: 2,
  iconSize: 16,
  formSchema: () => ({ steps: [] }),
  formValues: () => ({}),
  formData: () => ({ steps: [] }),
  activeStepIndex: 0,
});

// Two-way binding for activeStepIndex
const activeStepModel = computed({
  get: () => props.activeStepIndex,
  set: (value: number) => {
    emit("update:activeStepIndex", value);
  },
});

// Two-way binding for formValues
const formValuesModel = computed({
  get: () => props.formValues,
  set: (value: any) => {
    emit("update:formValues", value);
  },
});

// Computed property for wrapper class (برای آبی کردن خطوط ابتدا و انتها)
const stepperWrapperClass = computed(() => {
  const lastStepIndex = (steps.value?.length || 1) - 1;
  const currentStepIndex = activeStepModel.value;
  console.log(currentStepIndex, lastStepIndex);

  if (currentStepIndex === lastStepIndex) {
    return "last-step-active";
  } else if (currentStepIndex >= 0) {
    return "first-step-active";
  }
  return "";
});

// Generate steps dynamically from formData
const steps = computed(() => {
  if (!props.formData?.steps || !Array.isArray(props.formData.steps)) {
    return [];
  }

  return props.formData.steps.map((step: Step, index: number) => {
    // Extract icon from settings
    const iconSetting = step.settings?.find((s) => s.key === "icon");
    const iconTypeSetting = step.settings?.find((s) => s.key === "icon_type");

    // Use mdi icon as fallback
    const defaultIcon = "mdi-file-document-outline";

    return {
      id: index,
      label: step.label?.en || step.label?.en || `Step ${index + 1}`,
      icon:
        iconTypeSetting?.value === "class"
          ? defaultIcon
          : iconSetting?.value || defaultIcon,
      object_id: step.object_id,
      tooltip: step.tooltip?.en || step.tooltip?.en || "",
    };
  });
});

// Safe access to current step sections from formData
const currentSections = computed(() => {
  try {
    // Check if formData exists and has steps property
    if (!props.formData?.steps || !Array.isArray(props.formData.steps)) {
      console.warn("formData.steps is not available");
      return null;
    }

    // Check if the current step exists in the steps array
    const currentStep = props.formData.steps[activeStepModel.value];
    if (!currentStep) {
      console.warn(`Step ${activeStepModel.value} not found in formData.steps`);
      return null;
    }

    // Check if sections exist for current step
    if (!currentStep.sections || !Array.isArray(currentStep.sections)) {
      console.warn(`No sections found for step ${activeStepModel.value}`);
      return null;
    }

    return currentStep.sections;
  } catch (error) {
    console.error("Error accessing current sections:", error);
    return null;
  }
});

// Get current step object
const currentStep = computed(() => {
  if (!props.formData?.steps || !Array.isArray(props.formData.steps)) {
    return null;
  }
  return props.formData.steps[activeStepModel.value] || null;
});

// Get current step label (currently unused but kept for reference)
const currentStepLabel = computed(() => {
  return (
    currentStep.value?.label?.fa || currentStep.value?.label?.en || "بدون عنوان"
  );
});

// Navigation methods
// Add this check to include steps validated but not yet the "activeStepModel"
// This assumes 'activeStepModel.value' is the index of the step currently shown.
const handleStepClick = (stepId: number) => {
  // Allow navigation to any step up to the current active step
  if (stepId <= activeStepModel.value) {
    activeStepModel.value = stepId;
    return;
  } // Allow navigation to the immediate next step *if* the current one is validated // This ensures the user can't skip multiple steps by clicking.

  if (
    stepId === activeStepModel.value + 1 &&
    validatedSteps.value.includes(activeStepModel.value)
  ) {
    activeStepModel.value = stepId;
    return;
  }
  // Allow navigation to any step that has *already* been fully validated (e.g. if the user hit 'Next' multiple times and is coming back).
  if (validatedSteps.value.includes(stepId)) {
    activeStepModel.value = stepId;
    return;
  }

  console.warn("این مرحله هنوز تکمیل یا اعتبارسنجی نشده است");
};

const goToPreviousStep = () => {
  if (activeStepModel.value > 0) {
    activeStepModel.value = activeStepModel.value - 1;
  }
};

const goToNextStep = () => {
  const maxStep = (steps.value?.length || 1) - 1;
  const currentStepIndex = activeStepModel.value;
  const current = props.formData?.steps?.[currentStepIndex];
  const newErrors: Record<string, Record<string, string>> = {};

  if (current && Array.isArray(current.sections)) {
    current.sections.forEach((section: any) => {
      const sectionId = section.object_id;
      section.fields?.forEach((field: any) => {
        const isRequired =
          Array.isArray(field.settings) &&
          field.settings.some(
            (s: any) => s.key === "required" && s.value === "true"
          );

        const fieldValue =
          field.data && typeof field.data === "object" && "value" in field.data
            ? field.data.value ?? ""
            : (typeof field.data === "string" ? field.data : "") ||
              (props.formValues?.[sectionId]?.[field.object_id] ?? "");

        // ✅ اگر فیلد خالیه و required هست
        if (isRequired && (fieldValue === "" || fieldValue == null)) {
          if (!newErrors[sectionId]) newErrors[sectionId] = {};
          newErrors[sectionId][field.object_id] = "This field is required";
          return;
        }

        // ✅ بررسی وجود validation
        const validationSetting = (field.settings as any[])?.find(
          (s) => "validation" in s
        );
        if (validationSetting) {
          const validationValue = validationSetting.validation;
          const functions = validationValue
            .split(",")
            .map((f: string) => f.trim())
            .filter(Boolean);

          for (const fnName of functions) {
            const fn = (validators as any)[fnName];
            if (typeof fn !== "function") {
              console.error(
                `⚠️ Validation function "${fnName}" not found in utils/validators.ts`
              );
              if (!newErrors[sectionId]) newErrors[sectionId] = {};
              newErrors[sectionId][
                field.object_id
              ] = `Validator "${fnName}" not found`;
              return;
            }

            const result = fn(fieldValue);
            if (result !== true) {
              if (!newErrors[sectionId]) newErrors[sectionId] = {};
              newErrors[sectionId][field.object_id] =
                typeof result === "string"
                  ? result
                  : `Validation failed: ${fnName}`;
              return;
            }
          }
        }
      });
    });
  }

  // ✅ اگر ارور داریم، ثبت و توقف
  if (Object.keys(newErrors).length > 0) {
    errors.value = newErrors;
    return;
  }

  // ✅ همه چیز درست ← مرحله معتبر
  errors.value = {};
  if (!validatedSteps.value.includes(activeStepModel.value)) {
    validatedSteps.value.push(activeStepModel.value);
  }

  // ✅ مرحله بعد
  if (activeStepModel.value < maxStep) {
    activeStepModel.value = activeStepModel.value + 1;
  }
};

const clearError = (sectionId: string, fieldId: string) => {
  const sectionErrors = errors.value[sectionId];
  if (!sectionErrors) return;

  const typedSectionErrors = sectionErrors as Record<string, string>;

  if (fieldId in typedSectionErrors) {
    delete typedSectionErrors[fieldId];
  }

  if (Object.keys(typedSectionErrors).length === 0) {
    delete errors.value[sectionId];
  }
};
</script>

<style scoped lang="scss">
.stepper-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0px;
  background: white;
  margin: 0;
}

.stepper-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  // خط قبل از مرحله اول
  &::before {
    content: "";
    flex: 0 0 40px;
    height: 2px;
    background: #e5e7eb;
    margin-bottom: 32px;
    transition: background 0.3s ease;
    margin-right: 0px;
  }

  // خط بعد از مرحله آخر
  &::after {
    content: "";
    flex: 0 0 40px;
    height: 2px;
    background: #e5e7eb;
    margin-bottom: 32px;
    transition: background 0.3s ease;
    margin-left: 0px;
  }

  // ✅ قانون جدید: اگر مرحله اول فعال است، خط قبل از آن آبی شود (درخواست شما)
  &.first-step-active::before {
    background: #368ec4;
  }

  // ✅ قانون جدید: اگر مرحله آخر فعال است، خط بعد از آن آبی شود
  &.last-step-active::after {
    background: #368ec4;
  }
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  width: 40px;
}

.stepper-wrapper::before,
.stepper-wrapper::after {
  /* ... */
  margin-bottom: 0px; /* ✅ از 32px به 0px تغییر دهید */
  /* ... */
}

.step-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid;
  cursor: pointer;
  background: white;
  flex-shrink: 0;

  &.inactive {
    border-color: #d1d4d4;
    background-color: #f2f2f2;

    :deep(.v-icon) {
      color: #9ca3af;
    }
  }

  &.completed {
    border-color: #368ec4;
    background: #368ec4;

    :deep(.v-icon) {
      color: white;
    }
  }

  &.active {
    border-color: #368ec4;
    background: #368ec4;
    box-shadow: 0 4px 8px -2px rgba(59, 130, 246, 0.3);
    transform: scale(1.05);

    :deep(.v-icon) {
      color: white;
    }
  }
}

.step-label {
  margin-top: 0px;
  text-align: center;
  width: 90px;

  /* تنظیمات پوزیشن مطلق */
  position: absolute; /* ✅ اضافه شود */
  top: 100%; /* ✅ لیبل را دقیقاً زیر دایره قرار دهید (100% از ارتفاع دایره) */
  left: 50%; /* ✅ برای وسط قرار گرفتن لیبل */
  transform: translateX(
    -50%
  ); /* ✅ برای وسط قرار گرفتن لیبل نسبت به مرکز دایره */
  padding-top: 8px; /* ✅ برای ایجاد فاصله بین دایره و متن */
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  /*white-space: nowrap;*/
  transition: color 0.3s ease;
  white-space: normal;

  &.label-inactive {
    color: #9ca3af;
  }

  &.label-completed {
    color: #3d3d3d;
  }

  &.label-active {
    color: #2563eb;
  }
}

.connector-line {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 -2px;
  margin-bottom: 0;
  min-width: 20px;
}

.line {
  width: 100%;
  transition: all 0.3s ease;
  background: #e5e7eb;

  &.line-completed {
    background: #3b82f6;
  }
}

.controls {
  margin-top: 0px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: #f1f1f1;
  padding: 13px;
}

.step-content {
  margin-top: 24px;
  padding: 0px;
  border-radius: 8px;
  max-height: 500px;
  overflow: auto;
}

.content-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
}

.content-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  text-align: center;
}

.debug-info {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  text-align: right;
  direction: rtl;

  p {
    margin: 8px 0;
    font-size: 14px;
  }

  pre {
    background: #f3f4f6;
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    margin: 8px 0;
  }

  .error-text {
    color: #ef4444;
    font-weight: 500;
  }

  .section-preview {
    background: #f9fafb;
    padding: 12px;
    margin: 8px 0;
    border-radius: 4px;
    border-right: 3px solid #3b82f6;

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .section-meta {
      font-size: 12px;
      color: #6b7280;

      span {
        margin: 0 8px 0 0;
      }
    }
  }
}

step-circle.inactive {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
