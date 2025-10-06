<template>
  <!-- :rail-width="41" -->
  <v-navigation-drawer
    :width="270"
    v-model="drawer"
    :rail="sidebar.isCollapsed"
    permanent
    app
    class="sidebar"
    :location="settings.direction === 'rtl' ? 'right' : 'left'"
    :class="{ 'sidebar--rtl': settings.direction === 'rtl' }"
  >
    <!-- Loading State -->
    <!-- <v-skeleton-loader
      v-if="sidebar.loading"
      type="list-item-avatar-two-line@10"
      class="mx-2 my-4"
      :style="{ opacity: 0.8 }"
    /> -->
    <div
      class="d-flex align-center justify-center"
      style="height: 100%"
      v-if="sidebar.loading"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
    </div>

    <!-- Content when not loading -->
    <template v-else>
      <!-- Top header with logo + version -->
      <div class="d-flex align-center justify-space-between mb-4 px-3">
        <!-- <LanguageSwitch v-if="!sidebar.isCollapsed" /> -->
        <small class="text-disabled text-caption">{{ appVersion }}</small>
      </div>

      <!-- Collapse Toggle -->
      <v-btn
        variant="text"
        icon
        @click="sidebar.toggleCollapse"
        class="mb-1 mx-auto"
        :aria-label="
          sidebar.isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'
        "
      >
        <v-icon :class="{ 'rotate-icon': settings.direction === 'rtl' }">
          {{ collapseIcon }}
        </v-icon>
      </v-btn>
      <!-- test icon -->
      <!-- <div class="panel-icon fonticon fonticon-change-request"></div> -->

      <!-- <v-divider class="my-2" /> -->
      <!-- Sections -->
      <div
        v-for="section in sidebar.sections"
        :key="section.id"
        class="section-wrapper"
      >
        <!-- Section Title -->
        <!-- <div v-if="!sidebar.isCollapsed" class="section-title mx-3 mb-2">
          <h4 class="font-13" style="cursor: default">
            {{ section.label[settings.locale] }}
          </h4>
        </div> -->

        <div class="panel-icon fonticon fonticon-default"></div>
        <!-- Menu Items -->
        <SidebarParentItem
          v-for="item in section.items"
          :key="item.id"
          :item="item"
          :is-collapsed="sidebar.isCollapsed"
          :locale="settings.locale"
          :get-item-class="getItemClass"
        />
      </div>
    </template>

    <!-- Error State -->
    <v-alert
      v-if="sidebar.error"
      type="error"
      :text="sidebar.error"
      class="mx-3 my-2"
      density="compact"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSidebarStore } from "../stores/sidebar";
import { useSettingsStore } from "../stores/settings";
import LanguageSwitch from "./LanguageSwitch.vue";
import SidebarParentItem from "./SidebarParentItem.vue";
import type { MenuItem } from "@/types/menu";

// Reactive state for drawer visibility
const drawer = ref(true);

// Store instances
const sidebar = useSidebarStore();
const settings = useSettingsStore();

const isRtl = computed(() => {
  return settings.direction === "rtl";
});

// Application version from environment
const appVersion = import.meta.env.VITE_APP_VERSION || "v0.0.0";

const collapseIcon = computed(() => {
  const isRtl = settings.direction === "rtl";

  if (isRtl) {
    return sidebar.isCollapsed
      ? "mdi-chevron-double-left"
      : "mdi-chevron-double-right";
  } else {
    return sidebar.isCollapsed
      ? "mdi-chevron-double-right"
      : "mdi-chevron-double-left";
  }
});

const getItemClass = (item: MenuItem) => {
  const direction = isRtl.value ? "text-left pl-2" : "text-right pr-2";
  const iconClass = item.icon || "panel-icon fonticon fonticon-default";
  return [iconClass, direction];
};

// Load sidebar sections on component mount
onMounted(() => {
  sidebar.loadSections(false);
});
</script>

<style scoped>
/* Sidebar container */
.sidebar {
  transition: width 0.3s ease;
}

/* RTL-specific adjustments */
.sidebar--rtl {
  direction: rtl;
}

/* Section title styling */
.section-title {
  padding: 8px 0;
  color: var(--v-theme-text-primary);
}

/* Sidebar item styling */
.sidebar-item {
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

/* Active sidebar item */
.sidebar-item--active {
  background-color: var(--v-theme-primary-lighten-1);
  color: var(--v-theme-primary);
}

/* Icon rotation for RTL */
.rotate-icon {
  transform: rotate(180deg);
}

/* Language buttons container */
.lang-buttons {
  display: flex;
  gap: 4px;
}

/* Hover effect for items */
.sidebar-item:hover,
ist-item :hover {
  background-color: var(--v-theme-surface-variant);
  cursor: pointer !important;
}
</style>
