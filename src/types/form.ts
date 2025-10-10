import type { MenuItem } from "./menu";

interface LabelTooltip {
  en: string;
  fa: string;
}

interface Setting {
  key: string;
  value: string;
}

export interface Field {
  object_id: string;
  label: LabelTooltip;
  tooltip: LabelTooltip;
  id: string;
  description: string;
  type: string;
  value?: any;
  input: {
    type: string;
  };
}

export interface Section {
  type: string;
  tooltip: LabelTooltip;
  id: string;
  object_id: string;
  collapsable: boolean;
  label: Record<string, string>;
  description: string;
  items?: MenuItem[];
  fields: Field[];
}

// interface Step {
//   object_id: string;
//   type: "STEP";
//   label: LabelTooltip;
//   tooltip: LabelTooltip;
//   settings: Setting[];
//   sections: Section[];
// }

interface Setting {
  key: string;
  value: string;
}

interface Label {
  en: string;
  fa: string;
}

export interface Step {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  settings: Setting[];
  sections: Section[];
}

export interface FormData {
  steps?: Step[];
  [key: string]: any;
}
