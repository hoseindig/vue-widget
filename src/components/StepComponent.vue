<!-- StepComponent.vue -->
<template>
  <div class="steps-container">
    <v-stepper v-model="currentStep" flat>
      <v-stepper-header>
        <template v-for="(step, index) in steps" :key="step.object_id">
          <v-stepper-item :value="index + 1">
            <div class="step-content">
              <!-- آیکون از settings با key: 'icon' -->
              <div :class="getIconClass(step.settings)"></div>
              <!-- نمایش لیبل به زبان فارسی -->
              <span>{{ step.label.fa }}</span>
            </div>
          </v-stepper-item>
          <v-divider v-if="index < steps.length - 1"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script setup>
import { ref } from "vue";

// داده‌های JSON شما
const steps = ref([
  {
    object_id: "FirstStep",
    type: "STEP",
    label: { en: "Step 1", fa: "قدم اول" },
    tooltip: { en: "Step 1", fa: "قدم اول" },
    settings: [
      { key: "icon_type", value: "class" },
      { key: "icon", value: "panel-icon fonticon fonticon-clock" },
    ],
  },
  {
    object_id: "SecondStep",
    type: "STEP",
    label: { en: "Step 2", fa: "قدم دوم" },
    tooltip: { en: "Step 2", fa: "قدم دوم" },
    settings: [
      { key: "icon_type", value: "class" },
      { key: "icon", value: "panel-icon fonticon fonticon-clock" },
    ],
  },
]);

// متغیر برای کنترل استپ فعال
const currentStep = ref(1);

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
  align-items: center;
  gap: 8px;
}

/* استایل‌های اضافی برای آیکون‌ها */
.panel-icon {
  font-size: 24px;
}

/* در صورت نیاز به فونت آیکون خاص، باید فونت مربوطه را وارد کنید */
@import "@mdi/font/css/materialdesignicons.min.css";
</style>
