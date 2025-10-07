<template>
  <v-container>
    <v-form v-model="isValid" ref="formRef">
      <div v-for="section in sections" :key="section.object_id" class="mb-6">
        <v-expansion-panels v-if="section.collapsable" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ section.label.en }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <SectionFields
                :fields="section.fields"
                v-model="getSectionModel(section.object_id).value"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div v-else>
          <h3 class="text-lg font-semibold mb-4">{{ section.label.en }}</h3>
          <SectionFields
            :fields="section.fields"
            v-model="getSectionModel(section.object_id).value"
          />
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"; // computed را اضافه کنید
import type { PropType } from "vue";
import SectionFields from "./SectionFields.vue";

// ... interfaces

const props = defineProps<{
  sections: Section[];
  // 1. دریافت دیتای کاربر از StepBase با v-model:form-values
  formValues: Record<string, Record<string, any>>;
}>();

const emit = defineEmits<{
  // 2. Emit برای آپدیت دیتای کاربر در StepBase
  (e: "update:formValues", value: Record<string, Record<string, any>>): void;
}>();

const isValid = ref(false);
const formRef = ref();

// حذف: const formValues = reactive<Record<string, Record<string, any>>>({});
// حذف: منطق props.sections.forEach

// تابع برای ایجاد computed property برای هر بخش از فرم
function getSectionModel(sectionId: string) {
  return computed({
    get: () => {
      // برگرداندن دیتای بخش یا یک شیء خالی
      return props.formValues[sectionId] || {};
    },
    set: (sectionData: Record<string, any>) => {
      // انتشار تغییر به StepBase برای آپدیت کل شیء دیتای فرم
      emit("update:formValues", {
        ...props.formValues, // حفظ دیتای سایر بخش ها
        [sectionId]: sectionData, // آپدیت دیتای بخش جاری
      });
    },
  });
}

function submitForm() {
  if (formRef.value?.validate()) {
    // استفاده از props.formValues که اکنون دیتای کامل کاربر را دارد
    console.log("📤 فرم نهایی:", JSON.parse(JSON.stringify(props.formValues)));
    alert("فرم در کنسول چاپ شد");
  }
}
</script>
