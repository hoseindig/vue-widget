<template>
  <select
    class="custom-height mt-1"
    :multiple="selection === 'MULTIPLE'"
    :value="modelValue"
    @change="onChange"
  >
    {{
      options
    }}
    <option v-for="(item, i) in options" :key="i" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | string[]; // پشتیبانی از چند انتخابی
  options: string[];
  selection?: "SINGLE" | "MULTIPLE";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;

  if (props.selection === "MULTIPLE") {
    const selected = Array.from(target.selectedOptions).map((opt) => opt.value);
    emit("update:modelValue", selected);
  } else {
    emit("update:modelValue", target.value);
  }
};
</script>

<style scoped>
.custom-height {
  height: 24px;
  width: 100%;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  padding: 5px;
}
</style>
