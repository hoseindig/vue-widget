<template>
  <v-tooltip v-if="tooltip" location="top">
    @@{{ date }}@@
    <template #activator="{ props: tooltipProps }">
      <!-- <input
        v-bind="tooltipProps"
        type="text"
        class="custom-height mt-1"
        :class="{ 'input-error': hasError }"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      /> -->

      <DatePicker
        v-model="date"
        :locale="locale === 'Gregorian' ? 'en' : 'fa'"
        :format="format"
        @change="onInput"
      />
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>

  <DatePicker
    v-else
    v-model="date"
    :locale="locale === 'Gregorian' ? 'en' : 'fa'"
    :format="format"
    @change="onInput"
  />
  <!-- <input
    v-else
    type="text"
    class="custom-height mt-1"
    :class="{ 'input-error': hasError }"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
  /> -->
</template>

<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "vue3-persian-datetime-picker";
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  tooltip?: string;
  hasError?: boolean;
  format?: boolean;
  locale?: boolean;
}>();

const date = ref("");

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (value: string) => {
  const val = JSON.parse(JSON.stringify(value));
  console.log(val);

  emit("update:modelValue", val);
};
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
