// D:\project\vue\vue-widget\src\components\SectionFields.vue

<template>
  <v-row dense>
    <v-col
      v-for="field in fields"
      :key="field.object_id"
      cols="12"
      md="12"
      style="text-align: left"
    >
      <label for="" class="custom-label">{{ field.label.en }} </label>
      <span style="color: red">{{
        field?.settings?.find((s) => s.key === "required" && s.value === "true")
          ? " *"
          : ""
      }}</span>
      <v-tooltip v-if="field.tooltip" location="top">
        <template #activator="{ props: tooltipProps }">
          <!-- :label="field.label.en" -->
          {{ field.data }}
          <!-- <v-text-field
            v-bind="tooltipProps"
            v-model="fieldModel[field.object_id]"
            variant="outlined"
            hide-details="auto"
            class="custom-height"
          ></v-text-field> -->
          <input
            type="text"
            name=""
            id=""
            v-bind="tooltipProps"
            v-model="fieldModel[field.object_id]"
            class="custom-height mt-1"
          />
        </template>
        <span>{{ field.tooltip.en }}</span>
      </v-tooltip>
      <div v-else>
        <input
          type="text"
          name=""
          id=""
          v-model="fieldModel[field.object_id].value"
          class="custom-height"
        />
        <!-- <v-text-field
          v-model="fieldModel[field.object_id]"
          variant="outlined"
          hide-details="auto"
        ></v-text-field> -->
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Field } from "@/types/form";
import { computed } from "vue";

// interface Field {
//   object_id: string;
//   label: { en: string; fa: string };
//   tooltip?: { en: string; fa: string };
//   input: {
//     type: string;
//   };
// }

const props = defineProps<{
  fields: Field[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
}>();

//   computed property   v-model
const fieldModel = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    //   update:modelValue   emit
    emit("update:modelValue", newValue);
  },
});
</script>

<style scoped>
.custom-height {
  height: 30px;
  width: 100%;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  padding: 5px;
}
.custom-height .v-field__input {
  padding-top: 2px;
  padding-bottom: 2px;
}

.custom-label {
  font-size: 14px;
  font-weight: bold;
}
</style>
