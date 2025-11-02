<template>
  <v-tooltip v-if="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <input
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

  <input
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
