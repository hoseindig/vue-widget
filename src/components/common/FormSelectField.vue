<template>
  <select class="custom-height mt-1" :value="modelValue" @change="onChange">
    <option v-for="(item, i) in options" :key="i" :value="item">
      {{ item }}
    </option>
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number;
  options: (string | number)[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  emit("update:modelValue", value);
};
</script>

<style scoped>
.custom-height {
  height: 30px;
  width: 100%;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  padding: 5px;
}
</style>
