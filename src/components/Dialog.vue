<template>
  <v-dialog v-model="dialog" max-width="538">
    <!-- <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary"> Open Dialog </v-btn>
    </template> -->
    <v-card class="pa-0">
      <v-card-title
        class="pa-4 flex items-center justify-between w-full text-[16px]"
      >
        <v-btn
          icon
          variant="text"
          size="small"
          @click="dialog = false"
          class="close-btn order-1"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <span class="font-semibold order-2">Form Dialog</span>
      </v-card-title>

      <!-- جداکننده بصری زیر هدر -->
      <v-divider></v-divider>

      <div class="mt-4">
        <v-card-text class="pa-0 ma-0">
          <div style="">
            <CustomStep
              :form-schema="formDataAsFormData"
              :form-data="formDataAsFormData"
              v-model:form-values="formValues"
              v-model:active-step-index="activeStepIndex"
            />
          </div>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { FormData } from "@/types/form";
import CustomStep from "./CustomStep.vue";

interface Props {
  formData: FormData | FormData[];
}

const props = defineProps<Props>();

// تبدیل به FormData تکی
const formDataAsFormData = computed((): FormData => {
  if (Array.isArray(props.formData)) {
    return props.formData[0] || { steps: [] };
  }
  return props.formData;
});

// برای تست، دیالوگ را به صورت پیش‌فرض باز نگه می‌داریم تا دکمه دیده شود.
const dialog = defineModel<boolean>();
const formValues = ref({});
const activeStepIndex = ref(0);
</script>

<style scoped>
/* Vuetify v-card-text به صورت پیش‌فرض پدینگ دارد، که اینجا حذف می‌شود */
.v-card-text {
  padding: 0 !important;
}

/* استایل‌دهی دکمه بستن برای حذف margin پیش‌فرض Vuetify */
.close-btn {
  margin: 0 !important;
  right: 15px;
  position: absolute;
}

/* برای اعمال ارتفاع 35px بر روی v-card-title */
:deep(.v-card-title) {
  /* تنظیم ارتفاع ثابت و حداکثر ارتفاع */
  height: 35px !important;
  min-height: 35px !important;
  max-height: 35px !important;

  /* تنظیم پدینگ عمودی برای ترازبندی مرکزی */
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 16px !important;
  padding-right: 16px !important;

  display: flex !important;
  align-items: center !important;
}

/* تنظیم اندازه فونت عنوان برای متناسب بودن با ارتفاع کم */
:deep(.v-card-title .font-semibold) {
  font-size: 16px;
  font-weight: bold;
}
</style>
