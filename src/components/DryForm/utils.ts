import { z } from "zod";
import { FormField, ValidationConfig } from "./types";

// Zod validationlarını dinamik şekilde işlemek için helper fonksiyonu
const applyValidationRules = (
  schema: z.ZodAny | z.ZodString | z.ZodNumber | z.ZodDate,
  validation: ValidationConfig
) => {
  if (schema instanceof z.ZodString) {
    if (validation.minLength) {
      schema = schema.min(
        validation.minLength,
        `Must be at least ${validation.minLength} characters long`
      );
    }
    if (validation.maxLength) {
      schema = schema.max(
        validation.maxLength,
        `Must be at most ${validation.maxLength} characters long`
      );
    }
    if (validation.regex) {
      schema = schema.regex(
        new RegExp(validation.regex),
        "Enter a valid format"
      );
    }
    if (validation.startsWith) {
      schema = schema.startsWith(
        validation.startsWith,
        `Fields must start with ${validation.startsWith}`
      );
    }
    if (validation.endsWith) {
      schema = schema.endsWith(
        validation.endsWith,
        `Field must ends with ${validation.endsWith}`
      );
    }
    if (validation.email) {
      schema = schema.email("Enter a valid email address");
    }
  }

  if (schema instanceof z.ZodNumber) {
    if (typeof validation.min === "number") {
      schema = schema.gte(
        validation.min,
        `Number should be greater or equal to ${validation.min}`
      );
    }
    if (typeof validation.max === "number") {
      schema = schema.lte(
        validation.max,
        `Number should be less or equal to ${validation.max}`
      );
    }
  }

  if (schema instanceof z.ZodDate) {
    if (validation.min && typeof validation.min === "string") {
      schema = schema.min(
        new Date(validation.min),
        `Date must be ${validation.min} or later`
      );
    }
    if (validation.max && typeof validation.max === "string") {
      schema = schema.max(
        new Date(validation.max),
        `Date must be ${validation.max} or before`
      );
    }
  }

  return schema;
};

export const createZodSchema = (fields: FormField[]) => {
  const schemaShape = fields.reduce((acc, field) => {
    let fieldSchema: z.ZodAny | z.ZodString | z.ZodNumber | z.ZodDate;

    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "email"
    ) {
      fieldSchema = z.string();
      if (field.validation) {
        fieldSchema = applyValidationRules(fieldSchema, field.validation);
      }
    } else if (field.type === "date") {
      fieldSchema = z.date();
      if (field.validation) {
        fieldSchema = applyValidationRules(fieldSchema, field.validation);
      }
    } else if (field.type === "number") {
      fieldSchema = z.number();
      if (field.validation) {
        fieldSchema = applyValidationRules(fieldSchema, field.validation);
      }
    } else {
      fieldSchema = z.string(); // Fallback for unexpected types
    }

    acc[field.name] = field.required ? fieldSchema : fieldSchema.optional();
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object(schemaShape);
};
