<template>
  <v-stepper v-model="step" :items="items" show-actions editable>
    <template
      v-for="(item, index) in items"
      :key="index"
      v-slot:[`item.${index+1}`]
    >
      <div class="pa-4 text-center">
        <h3>محتوای استپ {{ index + 1 }} - {{ item }}</h3>
      </div>
    </template>
  </v-stepper>
</template>

<script setup>
import { ref } from "vue";

const step = ref(1);
const items = ["استپ اول", "استپ دوم", "استپ سوم", "استپ چهارم"];
</script>
