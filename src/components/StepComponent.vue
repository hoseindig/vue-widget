<template>
  <v-container>
    <h2 class="text-h5 mb-4">نمایش مراحل (Steps)</h2>

    <v-stepper :items="stepLabelsFa" v-model="currentStep" direction="vertical">
      <template v-for="(step, index) in stepsData" :key="step.object_id">
        <v-stepper-item
          :value="index + 1"
          :title="step.label.fa"
          :subtitle="step.tooltip.fa"
        >
          <template v-slot:icon>
            <div
              v-if="getIconClass(step)"
              :class="getIconClass(step)"
              class="v-stepper-item__icon-div"
              :title="step.label.fa"
            ></div>
            <span v-else class="v-stepper-item__icon-number">{{
              index + 1
            }}</span>
          </template>

          <div class="pa-4 border rounded-lg bg-grey-lighten-4">
            <p>
              محتوای جزئیات مربوط به: <strong>{{ step.label.fa }}</strong>
            </p>
          </div>
        </v-stepper-item>

        <v-divider
          v-if="index < stepsData.length - 1"
          :key="`divider-${step.object_id}`"
        ></v-divider>
      </template>
    </v-stepper>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// --- رابط‌ها (Interfaces) برای تعریف ساختار داده ---

interface LabelTooltip {
  en: string;
  fa: string;
}

interface Setting {
  key: string;
  value: string;
}

interface Field {
  object_id: string;
  type: "FIELD";
  label: LabelTooltip;
  tooltip: LabelTooltip;
  // ... سایر ویژگی‌های فیلد که برای این کامپوننت لازم نیستند
}

interface Section {
  object_id: string;
  type: "SECTION";
  label: LabelTooltip;
  tooltip: LabelTooltip;
  collapsable: boolean;
  fields: Field[];
}

interface Step {
  object_id: string;
  type: "STEP";
  label: LabelTooltip;
  tooltip: LabelTooltip;
  settings: Setting[];
  sections: Section[];
}

// --- داده‌های JSON ارائه شده ---

const stepsData: Step[] = [
  {
    object_id: "FirstStep",
    type: "STEP",
    label: { en: "Step 1", fa: "قدم اول" },
    tooltip: { en: "Step 1", fa: "قدم اول" },
    settings: [
      { key: "icon_type", value: "class" },
      { key: "icon", value: "panel-icon fonticon fonticon-clock" },
    ],
    sections: [
      /* ... */
    ],
  },
  {
    object_id: "SecondStep",
    type: "STEP",
    label: { en: "Step 2", fa: "قدم دوم" },
    tooltip: { en: "Step 2", fa: "قدم دوم" },
    settings: [
      { key: "icon_type", value: "class" },
      // برای نمایش بهتر، یک کلاس آیکون متفاوت برای Step 2 در نظر گرفته شده است (مثلاً یک آیکون Vuetify یا MDI)
      { key: "icon", value: "mdi-check-circle-outline" },
    ],
    sections: [
      /* ... */
    ],
  },
];

// --- وضعیت (State) ---

// مرحله فعال فعلی، به طور پیش‌فرض مرحله 1 فعال است
const currentStep = ref(1);

// --- Computed Properties ---

// استخراج برچسب‌های فارسی برای استفاده در props آیتم‌های v-stepper (اختیاری)
const stepLabelsFa = computed(() => stepsData.map((step) => step.label.fa));

// --- توابع (Functions) ---

/**
 * کلاس CSS آیکون را از آرایه settings استخراج می‌کند.
 * @param step - شیء مرحله (Step)
 * @returns کلاس CSS آیکون به صورت رشته، یا null در صورت عدم وجود
 */
function getIconClass(step: Step): string | null {
  const iconSetting = step.settings.find((setting) => setting.key === "icon");
  // اگر کلاس آیکون موجود باشد، آن را برمی‌گرداند.
  // توجه: "fonticon fonticon-clock" و "panel-icon" باید در CSS پروژه شما تعریف شده باشند.
  // "mdi-check-circle-outline" یک کلاس از MDI است که توسط Vuetify پشتیبانی می‌شود.
  return iconSetting ? iconSetting.value : null;
}
</script>

<style scoped>
/* سبک‌های سفارشی برای div آیکون */
.v-stepper-item__icon-div {
  /* تنظیم اندازه و نمایش برای اطمینان از قرارگیری صحیح */
  width: 24px; /* اندازه استاندارد آیکون Vuetify */
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* افزودن یک رنگ پس‌زمینه ساده برای تمایز */
  background-color: #00796b; /* رنگ سبز Vuetify برای مثال */
  color: white;
  border-radius: 50%;
  font-size: 14px;

  /* اطمینان از اینکه کلاس‌های سفارشی اعمال می‌شوند */
  /* مثال: کلاس‌های آیکون شما (مثل fonticon) باید لود شوند */
}

/* در اینجا می‌توانید استایل‌هایی برای کلاس‌های آیکون سفارشی خود (مانند .fonticon-clock) قرار دهید 
   اگر از فونت آیکون سفارشی استفاده می‌کنید، باید مطمئن شوید که فونت در پروژه شما لود شده است. */
</style>
