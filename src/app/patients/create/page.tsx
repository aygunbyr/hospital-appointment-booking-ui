"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import DryForm from "@/components/DryForm";
import { FormField } from "@/components/DryForm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/services/apiService";
import { Patient } from "@/types/Patient";
import { CreatePatientRequest } from "@/types/dtos/CreatePatientRequest";
import { ServiceResult } from "@/types/ServiceResult";
import { AxiosError } from "axios";

export default function CreatePatient() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const formFields: FormField[] = [
    {
      label: "Full Name",
      type: "text",
      name: "fullName",
      placeholder: "Full Name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      label: "Phone",
      type: "text",
      name: "phone",
      placeholder: "Phone",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 30,
      },
    },
    {
      label: "Citizen ID",
      type: "text",
      name: "citizenID",
      placeholder: "Citizen ID",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 30,
      },
    },
  ];

  const createPatientMutation = useMutation<
    ServiceResult<Patient>,
    unknown,
    CreatePatientRequest
  >({
    mutationFn: (createPatientRequest: CreatePatientRequest) =>
      createPatient(createPatientRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push("/patients");
    },
    onError: (error) => {
      // @ts-no-check
      setErrors(
        error instanceof AxiosError ? error.response?.data?.errorMessage : []
      );
    },
  });

  return (
    <>
      <Typography variant="h4" mb={2}>
        Create Patient
      </Typography>
      {errors.map((error, index) => (
        <Alert
          key={index}
          severity="error"
          sx={{ width: "100%", marginBottom: 2 }}
        >
          {error}
        </Alert>
      ))}
      <DryForm
        mutationFn={{
          mutate: createPatientMutation.mutate,
          error: createPatientMutation.error,
          data: createPatientMutation.data,
        }}
        formFields={formFields}
      />
    </>
  );
}
