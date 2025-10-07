<!-- StepComponent.vue -->
<template>
  <div class="steps-container">
    <v-stepper
      :model-value="activeStep"
      flat
      :key="activeStep"
      @update:model-value="$emit('update:activeStep', $event)"
    >
      <v-stepper-header>
        <template v-for="(step, index) in stepsData" :key="step.object_id">
          <v-stepper-item :value="index + 1">
            <div class="step-content">
              <!-- آیکون از settings -->
              <div :class="getIconClass(step.settings)"></div>
              <!-- لیبل در پایین آیکون -->
              <span class="step-label">{{ step.label.fa }}</span>
            </div>
          </v-stepper-item>
          <v-divider
            v-if="index < stepsData.length - 1"
            :key="`divider-${index}`"
          ></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script setup>
import { computed } from "vue"; // اگر نیاز به computed باشد، اما فعلاً لازم نیست

// پراپس‌ها
const props = defineProps({
  stepsData: {
    type: Array,
    required: true,
    default: () => [],
  },
  activeStep: {
    type: Number,
    default: 1,
  },
});

// تعریف emit برای ارسال تغییرات به والد
const emit = defineEmits(["update:activeStep"]);

// تابع برای دریافت کلاس آیکون از settings
const getIconClass = (settings) => {
  const iconSetting = settings.find((setting) => setting.key === "icon");
  return iconSetting ? iconSetting.value : "";
};
</script>

<style scoped>
.steps-container {
  padding: 16px;
}

.step-content {
  display: flex;
  flex-direction: column; /* لیبل زیر آیکون */
  align-items: center;
  gap: 8px;
}

.step-label {
  font-size: 14px;
  text-align: center;
}

/* استایل‌های اضافی برای آیکون‌ها */
.panel-icon {
  font-size: 24px;
}

/* وارد کردن فونت آیکون */
@import "@mdi/font/css/materialdesignicons.min.css";
</style>
