<template>
  <v-tooltip v-if="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <textarea
        v-bind="tooltipProps"
        type="text"
        class="custom-height mt-1"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      />
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>

  <textarea
    v-else
    type="text"
    class="custom-height mt-1"
    :value="modelValue"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  tooltip?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
};
</script>

<style scoped>
.custom-height {
  height: 68px;
  width: 100%;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  padding: 5px;
  padding: 3px 6px;
}
</style>
