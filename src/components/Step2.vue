<template>
  <div class="stepper-container">
    <div class="stepper-wrapper">
      <template v-for="(step, index) in steps" :key="step.id">
        <!-- Step Circle -->
        <div class="step-item">
          <button
            @click="activeStep = step.id"
            :class="[
              'step-circle',
              {
                active: step.id === activeStep,
                completed: step.id < activeStep,
                inactive: step.id > activeStep,
              },
            ]"
            :style="{
              width: `${props.circleSize}px`,
              height: `${props.circleSize}px`,
            }"
          >
            <v-icon :icon="step.icon" :size="props.iconSize" />
          </button>

          <!-- Label -->
          <div class="step-label">
            <p
              :class="[
                'label-text',
                {
                  'label-active': step.id === activeStep,
                  'label-completed': step.id < activeStep,
                  'label-inactive': step.id > activeStep,
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
            :class="['line', { 'line-completed': step.id < activeStep }]"
            :style="{ height: `${props.lineThickness}px` }"
          />
        </div>
      </template>
    </div>

    <!-- Demo Controls -->
    <div class="controls">
      <v-btn
        @click="activeStep = Math.max(0, activeStep - 1)"
        :disabled="activeStep === 0"
        variant="outlined"
        color="grey"
      >
        Previous
      </v-btn>
      <v-btn
        @click="activeStep = Math.min(steps.length - 1, activeStep + 1)"
        :disabled="activeStep === steps.length - 1"
        color="primary"
      >
        Next
      </v-btn>
    </div>

    <!-- Step Content Display -->
    <div class="step-content">
      <h3 class="content-title">{{ steps[activeStep].label }}</h3>
      <p class="content-text">
        محتوای مرحله {{ activeStep + 1 }} اینجا نمایش داده می‌شود
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props for configuration
interface Props {
  circleSize?: number;
  lineThickness?: number;
  iconSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  circleSize: 40,
  lineThickness: 2,
  iconSize: 20,
});

const activeStep = ref(1);

const steps = [
  { id: 0, label: "Request Category", icon: "mdi-file-document-outline" },
  { id: 1, label: "Commitment Category", icon: "mdi-check-circle-outline" },
  { id: 2, label: "Request Details", icon: "mdi-file-document-outline" },
  { id: 3, label: "Attachments", icon: "mdi-paperclip" },
  { id: 4, label: "Summary", icon: "mdi-chart-bar" },
];
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
  margin: 0 4px;
  margin-bottom: 32px;
  min-width: 40px;
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
  text-align: center;
}

.content-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.content-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}
</style>