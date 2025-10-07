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
                v-model="formValues[section.object_id]"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div v-else>
          <h3 class="text-lg font-semibold mb-4">{{ section.label.fa }}</h3>
          <SectionFields
            :fields="section.fields"
            v-model="formValues[section.object_id]"
          />
        </div>
      </div>

      <v-btn color="primary" @click="submitForm">ارسال</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { PropType } from "vue";
import SectionFields from "./SectionFields.vue";

// نوع داده Section
interface Field {
  object_id: string;
  label: { en: string; fa: string };
  tooltip?: { en: string; fa: string };
  input: {
    type: string;
  };
}

interface Section {
  object_id: string;
  label: { en: string; fa: string };
  collapsable: boolean;
  fields: Field[];
}

const props = defineProps<{
  sections: Section[];
}>();

const formValues = reactive<Record<string, Record<string, any>>>({});
const isValid = ref(false);
const formRef = ref();

// مقدار اولیه برای هر سکشن و فیلد
props.sections.forEach((section) => {
  formValues[section.object_id] = {};
  section.fields.forEach((field) => {
    formValues[section.object_id][field.object_id] = "";
  });
});

function submitForm() {
  if (formRef.value?.validate()) {
    console.log("📤 فرم نهایی:", JSON.parse(JSON.stringify(formValues)));
    alert("فرم در کنسول چاپ شد");
  }
}
</script>
