<template>
  <div class="checkbox-group">
    <v-tooltip v-if="tooltip" location="top">
      <template #activator="{ props: tooltipProps }">
        <div v-bind="tooltipProps">
          <div v-for="(label, key) in options" :key="key" class="checkbox-item">
            <input
              type="checkbox"
              class="custom-checkbox"
              :id="key"
              :value="key"
              :checked="isChecked(key)"
              @change="onChange($event, key)"
            />
            <label :for="key" class="checkbox-label">{{ label }}</label>
          </div>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>

    <!-- بدون tooltip -->
    <div v-else>
      <div v-for="(label, key) in options" :key="key" class="checkbox-item">
        <input
          type="checkbox"
          class="custom-checkbox"
          :id="key"
          :value="key"
          :checked="isChecked(key)"
          @change="onChange($event, key)"
        />
        <label :for="key" class="checkbox-label">{{ label }}</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]; // آرایه‌ای از کلیدهای انتخاب‌شده
  options: Record<string, string>; // مثل range
  selection?: string; // اختیاری
  tooltip?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

// چک می‌کنه که آیا کلید تیک خورده یا نه
const isChecked = (key: string) => {
  return props.modelValue?.includes(key);
};

// تغییر مقدار checkbox
const onChange = (event: Event, key: string) => {
  const checked = (event.target as HTMLInputElement).checked;
  let updated = [...(props.modelValue || [])];

  if (checked && !updated.includes(key)) {
    updated.push(key);
  } else if (!checked && updated.includes(key)) {
    updated = updated.filter((k) => k !== key);
  }

  emit("update:modelValue", updated);
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 5px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  cursor: pointer;
}
</style>
