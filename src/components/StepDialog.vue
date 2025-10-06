<template>
  <v-dialog v-model="dialogModel" max-width="600">
    <v-card rounded="xl">
      <v-card-title>
        <v-stepper v-model="step" alt-labels>
          <v-stepper-header>
            <v-stepper-item :value="1" title="مرحله ۱" />
            <v-divider />
            <v-stepper-item :value="2" title="مرحله ۲" />
            <v-divider />
            <v-stepper-item :value="3" title="پایان" />
          </v-stepper-header>
        </v-stepper>
      </v-card-title>

      <v-card-text>
        <div v-if="step === 1">
          <v-text-field label="ایمیل" variant="outlined" />
        </div>
        <div v-else-if="step === 2">
          <v-text-field label="شماره تماس" variant="outlined" />
        </div>
        <div v-else>
          <p>✅ اطلاعات ثبت شد</p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn v-if="step > 1" variant="tonal" @click="step--">قبلی</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="step++">بعدی</v-btn>
        <v-btn v-else color="success" @click="dialogModel = false">بستن</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const step = ref(1);

// این computed ارتباط دوطرفه بین prop و emit برقرار می‌کند
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
