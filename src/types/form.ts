// src/types/form.ts

export interface Field {
  object_id: string;
  label: {
    en: string;
    fa: string;
  };
  tooltip?: {
    en: string;
    fa: string;
  };
  input: {
    type: string;
  };
  settings?: Array<{
    key: string;
    value: string;
  }>;
  // اضافه کردن property data
  data?:
    | {
        value: any;
      }
    | string;
}

export interface Section {
  object_id: string;
  label: {
    en: string;
    fa: string;
  };
  collapsable?: boolean;
  fields?: Field[];
}

export interface Step {
  object_id: string;
  label: {
    en: string;
    fa: string;
  };
  tooltip?: {
    en: string;
    fa: string;
  };
  settings?: Array<{
    key: string;
    value: string;
  }>;
  sections?: Section[];
}

export interface FormData {
  steps: Step[];
}
