<script setup lang="ts">
import type { PropType } from "vue";
import type { MenuItem } from "@/types/menu";

const props = defineProps({
  child: {
    type: Object as PropType<MenuItem>,
    required: true,
  },
  isCollapsed: {
    type: Boolean,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  getItemClass: {
    type: Function as PropType<(item: MenuItem) => string | string[]>,
    required: true,
  },
});
</script>

<template>
  <v-tooltip :text="child?.tooltip?.[locale] ?? ''">
    <template v-slot:activator="{ props }">
      <!-- <v-btn v-bind="props">Hover Over Me</v-btn> -->
      <div v-bind="props">
        <v-list-item
          v-bind="child.route ? { to: child.route } : {}"
          :disabled="child.disabled"
          class="my-0 py-0 mx-0"
          active-class="sidebar-item--active"
        >
          <template #prepend v-if="child.icon">
            <div
              :class="getItemClass(child)"
              class="default-icon-sidebar"
              style="font-size: 18px; color: #3d3d3d"
              :style="{ fontSize: !isCollapsed ? '18px' : 'x-large' }"
            />
          </template>

          <v-list-item-title v-if="!isCollapsed">
            <span class="font-13 no-wrap list-item text-child">
              {{ child.label[locale] }}
            </span>
          </v-list-item-title>
        </v-list-item>
      </div>
    </template>
  </v-tooltip>
</template>


<style scoped>
.text-child {
  background-color: #f9f9f9 !important;
  font-weight: bold !important;
  color: #77797c !important;
  white-space: normal !important;
  cursor: pointer !important;
}

/* On hover */
.text-child:hover {
  color: #3d3d3d !important;
}

/* On click (active) */
.text-child:active {
  color: #368ec4 !important;
}
</style>
