"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import DryForm from "@/components/DryForm";
import { FormField } from "@/components/DryForm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoctor } from "@/services/apiService";
import { Doctor } from "@/types/Doctor";
import { CreateDoctorRequest } from "@/types/dtos/CreateDoctorRequest";
import { ServiceResult } from "@/types/ServiceResult";

export default function CreateDoctor() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const formFields: FormField[] = [
    {
      label: "Name",
      type: "text",
      name: "name",
      placeholder: "Name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      label: "Branch",
      type: "text",
      name: "branch",
      placeholder: "Branch",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 30,
      },
    },
  ];

  const createDoctorMutation = useMutation<
    ServiceResult<Doctor>,
    unknown,
    CreateDoctorRequest
  >({
    mutationFn: (createDoctorRequest: CreateDoctorRequest) =>
      createDoctor(createDoctorRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push("/doctors");
    },
    onError: (error) => {
      // @ts-no-check
      setErrors(error.response?.data?.errorMessage || []);
    },
  });

  return (
    <>
      <Typography variant="h4" mb={2}>
        Create Doctor
      </Typography>
      {errors.map((error, index) => (
        <Typography key={index} color="error" mb="2">
          Validation Error: {error}
        </Typography>
      ))}
      <DryForm
        mutationFn={{
          mutate: createDoctorMutation.mutate,
          error: createDoctorMutation.error,
          data: createDoctorMutation.data,
        }}
        formFields={formFields}
      />
    </>
  );
}
