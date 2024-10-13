import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { z } from "zod";
import { createZodSchema } from "./utils";
import { FormField, SelectOptionsDictionary } from "./types";
import { UseMutateFunction } from "@tanstack/react-query";

interface MutationFn {
  mutate: UseMutateFunction<unknown, unknown, unknown, unknown>;
  error: unknown;
  data: unknown;
}

interface FormBuilderProps {
  mutationFn: MutationFn;
  formFields: FormField[];
  selectOptions?: SelectOptionsDictionary;
}

const DryForm: React.FC<FormBuilderProps> = ({ mutationFn, formFields }) => {
  const formSchema = createZodSchema(formFields);
  type FormData = z.infer<typeof formSchema>;

  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      formSchema.parse(formData);
      setErrors({});

      // Form verilerini gönder
      mutationFn.mutate(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors(fieldErrors);
      }
    }

    console.log(errors);
    console.log(mutationFn.error);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
          <TextField
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            variant="outlined"
            required={field.required}
            onChange={handleChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            type={field.type}
          />
        </div>
      ))}
      <Button type="submit" variant="contained" fullWidth>
        Send
      </Button>
    </form>
  );
};

export default DryForm;
