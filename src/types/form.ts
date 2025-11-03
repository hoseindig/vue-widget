// src/types/form.ts
export interface Input {
  type: string;
  range?: Record<string, string> | string[];
  selection?: "SINGLE" | "MULTIPLE";
}

export interface Field {
  object_id: string;
  label: {
    en: string;
    fa: string;
  };
  tooltip?: {
    en?: string;
    fa?: string;
  } | null;
  input: Input;
  settings?: Array<{
    key: string;
    value: string;
  }>;
  // اضافه کردن property data
  data?:
    | {
        value: any | any[];
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
    en?: string;
    fa?: string;
  } | null;
  settings?: Array<{
    key: string;
    value: string;
  }>;
  sections?: Section[];
}

export interface FormData {
  steps: Step[];
}
