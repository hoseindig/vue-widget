<template>
  <v-container fluid class="pa-6">
    <!-- Header Card -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-4">
            <div :class="iconClass"></div>
            <h1 class="text-h4 font-weight-bold">
              {{ stepData.label[locale] }}
            </h1>
          </div>
          <v-btn color="primary" variant="elevated" @click="toggleLanguage">
            {{ locale === "fa" ? "English" : "فارسی" }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- Sections -->
    <v-card
      v-for="section in stepData.sections"
      :key="section.object_id"
      class="mb-4"
      elevation="2"
    >
      <v-card-title
        class="bg-grey-lighten-3"
        :class="{ 'cursor-pointer': section.collapsable }"
        @click="section.collapsable && toggleSection(section.object_id)"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <span class="text-h6">{{ section.label[locale] }}</span>
          <v-icon v-if="section.collapsable">
            {{
              collapsedSections.has(section.object_id)
                ? "mdi-chevron-down"
                : "mdi-chevron-up"
            }}
          </v-icon>
        </div>
      </v-card-title>

      <v-expand-transition>
        <v-card-text
          v-show="!collapsedSections.has(section.object_id)"
          class="pt-6"
        >
          <v-form>
            <v-row>
              <v-col
                v-for="field in section.fields"
                :key="field.object_id"
                cols="12"
                :md="getFieldWidth(field)"
              >
                <!-- Text Box -->
                <v-text-field
                  v-if="field.input.type === 'text_box'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  :required="isRequired(field)"
                  :rules="isRequired(field) ? [requiredRule] : []"
                  variant="outlined"
                  density="comfortable"
                />

                <!-- Text Area -->
                <v-textarea
                  v-else-if="field.input.type === 'text_area'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  :required="isRequired(field)"
                  :rules="isRequired(field) ? [requiredRule] : []"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                />

                <!-- Combobox -->
                <v-select
                  v-else-if="field.input.type === 'combobox'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  :items="getComboboxItems(field)"
                  :multiple="field.input.selection === 'MULTIPLE'"
                  :required="isRequired(field)"
                  :rules="isRequired(field) ? [requiredRule] : []"
                  variant="outlined"
                  density="comfortable"
                  :chips="field.input.selection === 'MULTIPLE'"
                  :closable-chips="field.input.selection === 'MULTIPLE'"
                />

                <!-- Date Picker -->
                <v-text-field
                  v-else-if="field.input.type === 'date'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  :required="isRequired(field)"
                  :rules="isRequired(field) ? [requiredRule] : []"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                />

                <!-- Check Box -->
                <v-checkbox
                  v-else-if="field.input.type === 'check_box'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  density="comfortable"
                />

                <!-- Check List -->
                <div v-else-if="field.input.type === 'check_list'">
                  <div class="text-subtitle-2 mb-2">
                    {{ field.label[locale] }}
                  </div>
                  <v-checkbox
                    v-for="(label, key) in field.input.range"
                    :key="key"
                    v-model="formData[field.object_id]"
                    :label="label"
                    :value="key"
                    density="compact"
                    hide-details
                  />
                  <div class="text-caption text-grey mt-1">
                    {{ field.tooltip[locale] }}
                  </div>
                </div>

                <!-- Text Combo -->
                <div v-else-if="field.input.type === 'text_combo'">
                  <v-text-field
                    v-model="formData[field.object_id + '_value']"
                    :label="field.label[locale]"
                    :hint="field.tooltip[locale]"
                    variant="outlined"
                    density="comfortable"
                  >
                    <template #append>
                      <v-select
                        v-model="formData[field.object_id + '_unit']"
                        :items="getComboboxItems(field)"
                        variant="outlined"
                        density="compact"
                        hide-details
                        style="max-width: 120px"
                      />
                    </template>
                  </v-text-field>
                </div>

                <!-- Type Chooser -->
                <div v-else-if="field.input.type === 'type_chooser'">
                  <div class="text-subtitle-2 mb-3">
                    {{ field.label[locale] }}
                    <span v-if="isRequired(field)" class="text-error">*</span>
                  </div>
                  <v-row>
                    <v-col
                      v-for="type in field.input.types"
                      :key="type.internal_name"
                      cols="12"
                      sm="4"
                    >
                      <v-card
                        :color="
                          formData[field.object_id] === type.internal_name
                            ? 'primary'
                            : ''
                        "
                        :variant="
                          formData[field.object_id] === type.internal_name
                            ? 'elevated'
                            : 'outlined'
                        "
                        class="text-center pa-4 cursor-pointer"
                        @click="formData[field.object_id] = type.internal_name"
                        hover
                      >
                        <v-icon size="48" class="mb-2">mdi-cube-outline</v-icon>
                        <div class="font-weight-medium">
                          {{ type.display_name }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                  <div class="text-caption text-grey mt-2">
                    {{ field.tooltip[locale] }}
                  </div>
                </div>

                <!-- Vault Chooser -->
                <div v-else-if="field.input.type === 'vault_chooser'">
                  <div class="text-subtitle-2 mb-3">
                    {{ field.label[locale] }}
                  </div>
                  <v-row>
                    <v-col
                      v-for="vault in field.input.vaults"
                      :key="vault.internal_name"
                      cols="12"
                      sm="4"
                    >
                      <v-card
                        :color="
                          formData[field.object_id] === vault.internal_name
                            ? 'primary'
                            : ''
                        "
                        :variant="
                          formData[field.object_id] === vault.internal_name
                            ? 'elevated'
                            : 'outlined'
                        "
                        class="text-center pa-4 cursor-pointer"
                        @click="formData[field.object_id] = vault.internal_name"
                        hover
                      >
                        <v-icon size="48" class="mb-2">mdi-database</v-icon>
                        <div class="font-weight-medium">
                          {{ vault.display_name }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                  <div class="text-caption text-grey mt-2">
                    {{ field.tooltip[locale] }}
                  </div>
                </div>

                <!-- Search -->
                <v-autocomplete
                  v-else-if="field.input.type === 'search'"
                  v-model="formData[field.object_id]"
                  :label="field.label[locale]"
                  :hint="field.tooltip[locale]"
                  :multiple="field.input.selection === 'MULTIPLE'"
                  :required="isRequired(field)"
                  :rules="isRequired(field) ? [requiredRule] : []"
                  variant="outlined"
                  density="comfortable"
                  :chips="field.input.selection === 'MULTIPLE'"
                  :closable-chips="field.input.selection === 'MULTIPLE'"
                  :items="[]"
                  clearable
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-expand-transition>
    </v-card>

    <!-- Submit Button -->
    <v-card elevation="2">
      <v-card-actions class="pa-4">
        <v-btn
          color="success"
          variant="elevated"
          size="large"
          block
          @click="handleSubmit"
        >
          <v-icon start>mdi-content-save</v-icon>
          ذخیره
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

interface Label {
  en: string;
  fa: string;
}

interface Setting {
  key: string;
  value: string;
}

interface InputRange {
  [key: string]: string;
}

interface InputType {
  internal_name: string;
  display_name: string;
  icon: string;
  href?: string;
}

interface InputVault {
  internal_name: string;
  display_name: string;
  href: string;
}

interface Input {
  type: string;
  range?: InputRange;
  selection?: string;
  format?: string;
  calendar?: string;
  query?: string;
  types?: InputType[];
  vaults?: InputVault[];
}

interface Data {
  type: string;
  expression: string;
}

interface Relationship {
  name: string;
  direction: string;
}

interface Field {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  settings?: Setting[];
  data: Data;
  relationship?: Relationship;
  action: string;
  input: Input;
}

interface Section {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  collapsable: boolean;
  fields: Field[];
}

interface Step {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  settings: Setting[];
  sections: Section[];
}

// State
const locale = ref<"en" | "fa">("fa");
const collapsedSections = ref<Set<string>>(new Set());
const formData = reactive<Record<string, any>>({});

// Step Data
const stepData: Step = {
  object_id: "FirstStep",
  type: "STEP",
  label: {
    en: "Step 1",
    fa: "قدم اول",
  },
  tooltip: {
    en: "Step 1",
    fa: "قدم اول",
  },
  settings: [
    {
      key: "icon_type",
      value: "class",
    },
    {
      key: "icon",
      value: "mdi mdi-clock-outline",
    },
  ],
  sections: [
    {
      object_id: "Section1Step1",
      type: "SECTION",
      label: {
        en: "First Section",
        fa: "بخش اول",
      },
      tooltip: {
        en: "First Section",
        fa: "بخش اول",
      },
      collapsable: false,
      fields: [
        {
          object_id: "TypeField",
          type: "FIELD",
          label: {
            en: "Type",
            fa: "تایپ",
          },
          tooltip: {
            en: "Type",
            fa: "تایپ",
          },
          settings: [
            {
              key: "required",
              value: "true",
            },
          ],
          data: {
            type: "basic",
            expression: "type",
          },
          action: "NONE",
          input: {
            type: "type_chooser",
            types: [
              {
                internal_name: "ENC_Part",
                display_name: "Part",
                icon: "/common/images/part.png",
                href: "/3dspace/resources/cw/chooser/type?parent=ENC_Part",
              },
              {
                internal_name: "DCM_Document",
                display_name: "Document",
                icon: "/common/images/document.png",
                href: "/3dspace/resources/cw/chooser/type?parent=DCM_Document",
              },
              {
                internal_name: "ECM_CAD",
                display_name: "CAD",
                icon: "/common/images/cad.png",
                href: "/3dspace/resources/cw/chooser/type?parent=ECM_CAD",
              },
            ],
          },
        },
        {
          object_id: "TitleField",
          type: "FIELD",
          label: {
            en: "Title",
            fa: "عنوان",
          },
          tooltip: {
            en: "Title",
            fa: "عنوان",
          },
          data: {
            type: "attribute",
            expression: "Title",
          },
          action: "NONE",
          input: {
            type: "text_box",
          },
        },
        {
          object_id: "DescriptionField",
          type: "FIELD",
          label: {
            en: "Description",
            fa: "توضیحات",
          },
          tooltip: {
            en: "Description",
            fa: "توضیحات",
          },
          data: {
            type: "basic",
            expression: "description",
          },
          action: "NONE",
          input: {
            type: "text_area",
          },
        },
        {
          object_id: "PhaseField",
          type: "FIELD",
          label: {
            en: "Phase",
            fa: "فاز",
          },
          tooltip: {
            en: "Phase",
            fa: "فاز",
          },
          settings: [
            {
              key: "Default",
              value: "dev",
            },
          ],
          data: {
            type: "attribute",
            expression: "Phase",
          },
          action: "NONE",
          input: {
            type: "combobox",
            range: {
              dev: "Development",
              prod: "Production",
            },
            selection: "SINGLE",
          },
        },
        {
          object_id: "PartFamilyField",
          type: "FIELD",
          label: {
            en: "Part Family",
            fa: "خانواده قطعات",
          },
          tooltip: {
            en: "Part Family",
            fa: "خانواده قطعات",
          },
          data: {
            type: "relationship",
          },
          relationship: {
            name: "Classified Item",
            direction: "TO",
          },
          action: "NONE",
          input: {
            type: "search",
            query: "type:PartFamily AND owner:admin_platform",
            selection: "MULTIPLE",
          },
        },
      ],
    },
    {
      object_id: "Section2Step1",
      type: "SECTION",
      label: {
        en: "Second Section",
        fa: "بخش دوم",
      },
      tooltip: {
        en: "Second Section",
        fa: "بخش دوم",
      },
      collapsable: true,
      fields: [
        {
          object_id: "RelatedClassifiedItem",
          type: "FIELD",
          label: {
            en: "Target Release Date Label",
            fa: "تاریخ منتشر کردن هدف",
          },
          tooltip: {
            en: "Target Release Date Tooltip",
            fa: "تاریخ منتشر کردن هدف",
          },
          settings: [
            {
              key: "required",
              value: "true",
            },
          ],
          data: {
            type: "attribute",
            expression: "Target Release Date",
          },
          action: "NONE",
          input: {
            type: "date",
            format: "mm/dd/yyyy",
            calendar: "CHRISTIAN",
          },
        },
        {
          object_id: "IncludeSubTypeField",
          type: "FIELD",
          label: {
            en: "Include Sub Type",
            fa: "شامل شدن زیرتایپ ها",
          },
          tooltip: {
            en: "Include Sub Type",
            fa: "شامل شدن زیرتایپ ها",
          },
          data: {
            type: "attribute",
            expression: "IncludeSubType",
          },
          action: "NONE",
          input: {
            type: "check_box",
            range: {
              IncludeSubType: "Include Sub Type",
            },
            selection: "SINGLE",
          },
        },
        {
          object_id: "AuthorizedRoleField",
          type: "FIELD",
          label: {
            en: "Authorized Role",
            fa: "نقش های مجاز",
          },
          tooltip: {
            en: "Authorized Role",
            fa: "نقش های مجاز",
          },
          data: {
            type: "attribute",
            expression: "AuthorizedRole",
          },
          action: "NONE",
          input: {
            type: "combobox",
            range: {
              VPLMAdmin: "Admin",
              XBC_Admin: "Admin",
              XBC_ProcessCreator: "Process Creator",
            },
            selection: "MULTIPLE",
          },
        },
        {
          object_id: "ModelerField",
          type: "FIELD",
          label: {
            en: "Modeler",
            fa: "مدلر",
          },
          tooltip: {
            en: "Modeler",
            fa: "مدلر",
          },
          settings: [
            {
              key: "OnChange Handler",
              value: "refreshModelsField",
            },
          ],
          data: {
            type: "attribute",
            expression: "Modeler",
          },
          action: "NONE",
          input: {
            type: "combobox",
            range: {
              Camunda: "Camunda",
              Bizaji: "Bizaji",
            },
            selection: "MULTIPLE",
          },
        },
        {
          object_id: "CostField",
          type: "FIELD",
          label: {
            en: "Cost",
            fa: "هزینه",
          },
          tooltip: {
            en: "Cost",
            fa: "هزینه",
          },
          data: {
            type: "attribute",
            expression: "Cost",
          },
          action: "NONE",
          input: {
            type: "text_combo",
            range: {
              IRR: "Islamic Republic Rial",
              USD: "United States Dollar",
              EUR: "Euro",
            },
            selection: "SINGLE",
          },
        },
      ],
    },
  ],
};

// Computed
const iconClass = computed(() => {
  const iconSetting = stepData.settings.find((s) => s.key === "icon");
  return iconSetting ? iconSetting.value : "mdi mdi-help-circle";
});

// Methods
const toggleLanguage = () => {
  locale.value = locale.value === "fa" ? "en" : "fa";
};

const toggleSection = (sectionId: string) => {
  if (collapsedSections.value.has(sectionId)) {
    collapsedSections.value.delete(sectionId);
  } else {
    collapsedSections.value.add(sectionId);
  }
};

const isRequired = (field: Field): boolean => {
  return (
    field.settings?.some((s) => s.key === "required" && s.value === "true") ||
    false
  );
};

const requiredRule = (value: any) => {
  return !!value || "این فیلد الزامی است";
};

const getComboboxItems = (field: Field) => {
  if (!field.input.range) return [];
  return Object.entries(field.input.range).map(([value, title]) => ({
    value,
    title,
  }));
};

const getFieldWidth = (field: Field): number => {
  if (
    field.input.type === "type_chooser" ||
    field.input.type === "vault_chooser"
  ) {
    return 12;
  }
  if (field.input.type === "text_area") {
    return 12;
  }
  return 6;
};

const handleSubmit = () => {
  console.log("Form Data:", formData);
  alert("فرم با موفقیت ذخیره شد!");
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.w-100 {
  width: 100%;
}
</style>
