<template>
  <v-tooltip v-if="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <!-- <p>
        DatePicker : format : {{ format }} - date : {{ date }} - locale
        {{ locale }}
      </p> -->
      <DatePicker
        v-model="date"
        :locale="locale === 'Gregorian' ? 'en' : 'fa'"
        :displayFormat="locale === 'Gregorian' ? 'YYYY/MM/DD' : 'jYYYY/jMM/jDD'"
        :format="'YYYY/MM/DD'"
        @change="onInput"
      />
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
  <DatePicker
    v-else
    v-model="date"
    :locale="locale === 'Gregorian' ? 'en' : 'fa'"
    :format="locale === 'Gregorian' ? 'YYYY/MM/DD' : 'jYYYY/jMM/jDD'"
    :displayFormat="'YYYY/MM/DD'"
    @change="onInput"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import DatePicker from "vue3-persian-datetime-picker";
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  tooltip?: string;
  hasError?: boolean;
  format?: string;
  locale?: string;
}>();

const date = ref("");

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (value: string) => {
  const val = JSON.parse(JSON.stringify(value));
  // console.log(val);

  emit("update:modelValue", val);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // console.log("newVal", newVal);
      date.value = newVal;
    }
  }
);
</script>

<style scoped>
.input-error {
  border-color: red !important;
}

.custom-height {
  height: 24px;
  width: 100%;
  border: 1px solid #b4b6ba;
  border-radius: 5px;

  padding: 3px 6px;
  height: 24px;
  font-size: 12px;
}
input::placeholder {
  font-weight: 600;
  color: #b4b6ba;
}
</style>
