export interface ValidationConfig {
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  regex?: string;
  email?: boolean;
  startsWith?: string;
  endsWith?: string;
}

export interface FormField {
  label: string;
  type: "text" | "email" | "date" | "number" | "select" | "textarea"; // Add select and textarea
  name: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationConfig; // Validasyon kuralları
}

export type SelectOptionsDictionary = Record<
  string,
  { label: string; value: string }[]
>;
