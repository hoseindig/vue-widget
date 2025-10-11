<template>
  <div class="stepper-container">
    <div class="stepper-wrapper">
      <template v-for="(step, index) in steps" :key="step.object_id || step.id">
        <!-- Step Circle -->
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

          <!-- Label -->
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

        <!-- Connecting Line -->
        <div v-if="index < steps.length - 1" class="connector-line">
          <div
            :class="['line', { 'line-completed': step.id < activeStepModel }]"
            :style="{ height: `${props.lineThickness}px` }"
          />
        </div>
      </template>
    </div>

    <!-- Step Content Display -->
    <div class="step-content">
      <h3 class="content-title">{{ currentStepLabel }}</h3>
      <p class="content-text">
        محتوای مرحله {{ activeStepModel + 1 }} اینجا نمایش داده می‌شود
      </p>

      <!-- Debug Info -->
      <!-- <div class="debug-info">
        <p>
          <strong>مرحله فعال:</strong> {{ activeStepModel + 1 }} از
          {{ steps?.length || 0 }}
        </p>
        <p><strong>Object ID:</strong> {{ currentStep?.object_id }}</p>
        <p>
          <strong>تعداد Sections:</strong> {{ currentSections?.length || 0 }}
        </p>

        <template v-if="currentSections && currentSections.length > 0">
          <div
            v-for="(section, idx) in currentSections"
            :key="section.object_id"
            class="section-preview"
          >
            <h4>{{ section.label?.fa || section.label?.en }}</h4>
            <p class="section-meta">
              <span>فیلدها: {{ section.fields?.length || 0 }}</span>
              <span v-if="section.collapsable">• قابل جمع شدن</span>
            </p>
          </div>
        </template>
        <p v-else class="error-text">هیچ بخشی برای این مرحله یافت نشد</p>
      </div> -->

      <!-- Dynamic Form -->
      <DynamicForm
        v-if="currentSections"
        :sections="currentSections"
        v-model:form-values="formValuesModel"
      />
    </div>

    <!-- Demo Controls -->
    <div class="controls">
      <v-btn
        @click="goToPreviousStep"
        :disabled="activeStepModel === 0"
        variant="outlined"
        color="grey"
      >
        قبلی
      </v-btn>
      <v-btn
        @click="goToNextStep"
        :disabled="activeStepModel === (steps?.length || 1) - 1"
        color="primary"
      >
        بعدی
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FormData, Step } from "@/types/form";
import DynamicForm from "./DynamicForm.vue";

const emit = defineEmits<{
  (e: "update:formValues", value: any): void;
  (e: "update:activeStepIndex", value: number): void;
}>();

interface Props {
  circleSize?: number;
  lineThickness?: number;
  iconSize?: number;
  formSchema: FormData | FormData[];
  formData: FormData | FormData[];
  formValues: any;
  activeStepIndex: number;
}

const props = withDefaults(defineProps<Props>(), {
  circleSize: 40,
  lineThickness: 2,
  iconSize: 20,
  formSchema: () => [],
  formValues: () => ({}),
  formData: () => [],
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

// Generate steps dynamically from formData
const steps = computed(() => {
  if (!props.formData?.steps || !Array.isArray(props.formData.steps)) {
    return [];
  }

  return props.formData.steps.map((step, index) => {
    // Extract icon from settings
    const iconSetting = step.settings?.find((s: any) => s.key === "icon");
    const iconTypeSetting = step.settings?.find(
      (s: any) => s.key === "icon_type"
    );

    // Use mdi icon as fallback
    const defaultIcon = "mdi-file-document-outline";

    return {
      id: index,
      label: step.label?.fa || step.label?.en || `Step ${index + 1}`,
      icon:
        iconTypeSetting?.value === "class"
          ? defaultIcon
          : iconSetting?.value || defaultIcon,
      object_id: step.object_id,
      tooltip: step.tooltip?.fa || step.tooltip?.en || "",
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

// Get current step label
const currentStepLabel = computed(() => {
  return (
    currentStep.value?.label?.fa || currentStep.value?.label?.en || "بدون عنوان"
  );
});

// Navigation methods
const handleStepClick = (stepId: number) => {
  activeStepModel.value = stepId;
};

const goToPreviousStep = () => {
  if (activeStepModel.value > 0) {
    activeStepModel.value = activeStepModel.value - 1;
  }
};

const goToNextStep = () => {
  const maxStep = (steps.value?.length || 1) - 1;
  if (activeStepModel.value < maxStep) {
    activeStepModel.value = activeStepModel.value + 1;
  }
};
</script>

<style scoped lang="scss">
.stepper-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  background: white;
}

.stepper-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
}

.step-circle {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid;
  cursor: pointer;
  background: white;
  flex-shrink: 0;

  &.inactive {
    border-color: #d1d5db;
    background: white;

    :deep(.v-icon) {
      color: #9ca3af;
    }
  }

  &.completed {
    border-color: #3b82f6;
    background: #3b82f6;

    :deep(.v-icon) {
      color: white;
    }
  }

  &.active {
    border-color: #3b82f6;
    background: #3b82f6;
    box-shadow: 0 4px 8px -2px rgba(59, 130, 246, 0.3);
    transform: scale(1.05);

    :deep(.v-icon) {
      color: white;
    }
  }
}

.step-label {
  margin-top: 8px;
  text-align: center;
}

.label-text {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.3s ease;

  &.label-inactive {
    color: #9ca3af;
  }

  &.label-completed {
    color: #3b82f6;
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
  margin-bottom: 32px;
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
  margin-top: 48px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.step-content {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
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
</style>