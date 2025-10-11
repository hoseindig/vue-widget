<template>
  <div>
    <v-stepper v-model="stepModel" flat show-actions editable>
      <v-stepper-header>
        <v-stepper-item
          v-for="(step, index) in steps"
          :key="index"
          :value="index + 1"
          :complete="stepModel > index + 1"
          :active="stepModel === index + 1"
        >
          <template #label>
            <span>{{ step.label }}</span>
          </template>
          <template #default>
            <v-icon>{{ step.icon }}</v-icon>
          </template>
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-item
          v-for="step in steps"
          :key="step.label"
          :value="step.value"
        >
          <div class="text-center pa-4">
            <p>محتوای مرحله {{ step.label }}</p>
          </div>
        </v-stepper-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const stepModel = ref(2); // مرحله فعلی (Request Details)

const steps = [
  { label: "Request Category", icon: "mdi-file-document", value: 1 },
  { label: "Component", icon: "mdi-puzzle", value: 2 },
  { label: "Request Details", icon: "mdi-calendar", value: 3 },
  { label: "Attachments", icon: "mdi-paperclip", value: 4 },
  { label: "Summary", icon: "mdi-file-table", value: 5 },
];
</script>

<style scoped>
/* تنظیم رنگ مراحل کامل و فعلی به آبی */
.v-stepper-item--complete .v-stepper-item__indicator {
  background-color: #1976d2 !important;
  color: white !important;
}

.v-stepper-item--active .v-stepper-item__indicator {
  background-color: #1976d2 !important;
  color: white !important;
}

/* تنظیم رنگ خطوط بین مراحل */
.v-stepper-header .v-stepper-item:not(:last-child)::after {
  border-color: #1976d2 !important;
}
</style>