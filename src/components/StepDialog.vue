<template>
  <v-dialog v-model="dialogModel" max-width="600" persistent>
    <v-card class="rounded-xl pa-4 px-1">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6 font-weight-medium">New Request</div>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider class="my-2" />

      <!-- Stepper -->
      <v-stepper v-model="step" alt-labels class="pb-4">
        <v-stepper-header>
          <template v-for="(s, index) in steps" :key="s.object_id">
            <v-stepper-item :value="index + 1" :subtitle="s.tooltip[lang]">
              <!-- استفاده از اسلات برای اضافه کردن آیکون و برچسب -->
              <template #default>
                <div :class="getIconClass(s.settings)" />
                <!-- <span>{{ s.label[lang] }}</span> -->
              </template>
            </v-stepper-item>
            <v-divider v-if="index < steps.length - 1" />
          </template>
        </v-stepper-header>
      </v-stepper>

      <v-card-text class="scroll-y" style="max-height: 60vh">
        <!-- Step 1 -->
        <div v-if="step === 1">
          <v-text-field
            label="Title *"
            v-model="form.title"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            label="Request Category"
            variant="outlined"
            v-model="form.category"
          />
          <v-text-field
            label="Request Template"
            placeholder="Type here to search request template"
            variant="outlined"
          />
          <v-textarea
            label="Description"
            v-model="form.description"
            rows="3"
            auto-grow
            variant="outlined"
            hint="You can enter a maximum of 256 characters"
          />
        </div>

        <!-- Step 2 -->
        <div v-else-if="step === 2">
          <v-text-field
            label="Input Items"
            v-model="form.items"
            variant="outlined"
          />
          <v-text-field
            label="Due Date"
            type="date"
            v-model="form.dueDate"
            variant="outlined"
          />
          <v-text-field
            label="Context Project"
            v-model="form.project"
            variant="outlined"
          />
          <v-text-field
            label="Context Product"
            v-model="form.product"
            variant="outlined"
          />
          <v-text-field
            label="Context Plant"
            v-model="form.plant"
            variant="outlined"
          />
        </div>

        <!-- Step 3 -->
        <div v-else-if="step === 3">
          <v-textarea
            label="Extra Details"
            v-model="form.details"
            variant="outlined"
            rows="4"
          />
        </div>

        <!-- Step 4 -->
        <div v-else-if="step === 4">
          <v-file-input
            label="Attachments"
            v-model="form.files"
            variant="outlined"
            multiple
          />
        </div>

        <!-- Step 5 -->
        <div v-else>
          <p class="text-subtitle-1 mb-3">
            ✅ Review Summary before submission
          </p>
          <v-list density="compact">
            <v-list-item title="Title" :subtitle="form.title" />
            <v-list-item title="Category" :subtitle="form.category" />
            <v-list-item title="Due Date" :subtitle="form.dueDate" />
          </v-list>
        </div>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Footer -->
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="tonal" v-if="step > 1" @click="step--">Back</v-btn>
        <v-btn v-if="step < 5" color="primary" @click="step++">Next</v-btn>
        <v-btn v-else color="success" @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";

// تعریف نوع‌ها
interface Setting {
  key: string;
  value: string;
}

interface Label {
  en: string;
  fa: string;
}

interface Step {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  settings: Setting[];
  sections: any[];
}

interface FormData {
  steps?: Step[];
  [key: string]: any;
}

// تعریف پراپ‌ها
const props = defineProps<{
  modelValue: boolean;
  formData: FormData | FormData[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", value: any): void;
}>();

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const step = ref(1);

const form = ref<any>({});

const steps = computed(() => {
  if (!props.formData) return [];
  const item = Array.isArray(props.formData)
    ? props.formData[0]
    : props.formData;

  return (item?.steps || []).map((s: Step) => {
    const iconSetting = s.settings?.find((st: Setting) => st.key === "icon");
    return {
      ...s,
      icon: iconSetting?.value || "panel-icon fonticon fonticon-default",
    };
  });
});

// هر بار که prop جدید بیاد، فرم داخلی به‌روز میشه
watch(
  () => props.formData,
  (val) => {
    if (Array.isArray(val)) {
      form.value = { ...form.value, ...val[0] };
      console.log("formData (first item):", val[0]);
    } else {
      form.value = { ...form.value, ...val };
      console.log("formData:", JSON.parse(JSON.stringify(val)));
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit("submit", form.value);
  closeDialog();
};

const closeDialog = () => {
  dialogModel.value = false;
  step.value = 1;
};

// تعریف مقدار پیش‌فرض برای lang
const lang = defineModel<"en" | "fa">("lang", { default: "en" });

// استخراج کلاس آیکون از settings
const getIconClass = (settings: Setting[]): string => {
  const iconSetting = settings.find((setting) => setting.key === "icon");
  return iconSetting ? iconSetting.value : "";
};
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}
.v-stepper-item {
  display: flex;
  align-items: center;
}
.v-icon {
  margin-right: 8px;
}
</style>
