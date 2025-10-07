interface LabelTooltip {
  en: string;
  fa: string;
}

interface Setting {
  key: string;
  value: string;
}

interface Field {
  object_id: string;
  type: "FIELD";
  label: LabelTooltip;
  tooltip: LabelTooltip;
}

interface Section {
  object_id: string;
  type: "SECTION";
  label: LabelTooltip;
  tooltip: LabelTooltip;
  collapsable: boolean;
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

interface Step {
  object_id: string;
  type: string;
  label: Label;
  tooltip: Label;
  settings: Setting[];
  sections: any[];
}

interface FormData {
  steps?: Step[];
  [key: string]: any;
}
