<template>
  <div>
    <!-- {{ formData }} -->
    <v-stepper v-model="step" :items="stepLabels" show-actions editable>
      <template
        v-for="(item, index) in formData.steps"
        :key="index"
        v-slot:[`item.${index+1}`]
      >
        <div class="pa-4 text-center">
          <h3>محتوای استپ {{ index + 1 }} - {{ item.label.en }}</h3>
          <p>{{ step }}</p>
          <!-- {{ item.sections }} -->
        </div>
      </template>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { FormData } from "@/types/form";

const step = ref(1);
// const items = ["استپ اول", "استپ دوم", "استپ سوم", "استپ چهارم"];
const form = ref<any>({});

const props = defineProps<{
  modelValue: boolean;
  formData: FormData | FormData[];
}>();

const stepLabels = computed(() => {
  if (Array.isArray(props.formData)) {
    return props.formData.map((item) => item.label.fa);
  } else {
    return props.formData.steps.map((item) => item.label.fa);
  }
});

watch(
  () => props.formData,
  (val) => {
    if (!val) {
      console.error("formData");
    } else if (Array.isArray(val)) {
      form.value = { ...form.value, ...val[0] };
      console.log("formData (first item):", val[0]);
    } else {
      form.value = { ...form.value, ...val };
      console.log("formData:", JSON.parse(JSON.stringify(val)));
    }
  },
  { immediate: true }
);
</script>
