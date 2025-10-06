<script setup lang="ts">
import type { PropType } from "vue";
import type { MenuItem } from "@/types/menu"; // adjust path to your types file
import SidebarChildItem from "./SidebarChildItem.vue";

const props = defineProps({
  item: {
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
  <div :title="item.tooltip?.[locale] || ''">
    <!-- Section Label -->
    <span v-if="!isCollapsed" class="mx-2 my-2 font-13" style="cursor: default">
      {{ item.label[locale] || "Section Label" }}
    </span>

    <!-- Parent Command -->
    <v-list-item
      v-if="item.route && item.type === 'command'"
      :to="item.route"
      :disabled="item.disabled"
      active-class="sidebar-item--active"
    >
      <template #prepend>
        <div :class="getItemClass(item)" />
      </template>

      <v-list-item-title v-if="!isCollapsed">
        <span class="font-13">{{ item.label[locale] }}</span>
      </v-list-item-title>
    </v-list-item>

    <!-- Children -->
    <SidebarChildItem
      v-for="child in item.children"
      :key="child.id"
      :child="child"
      :is-collapsed="isCollapsed"
      :locale="locale"
      :get-item-class="getItemClass"
    />

    <div
      style="width: auto; height: 1px; background-color: lightgray"
      :style="!isCollapsed ? { margin: '15px 30px 0 25px' } : {}"
    ></div>

    <v-divider v-if="item.children?.length" class="my-2" />
  </div>
</template>