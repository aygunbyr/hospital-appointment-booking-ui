"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import DryForm from "@/components/DryForm";
import { FormField } from "@/components/DryForm/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/services/apiService";
import { Appointment } from "@/types/Appointment";
import { CreateAppointmentRequest } from "@/types/dtos/CreateAppointmentRequest";
import { ServiceResult } from "@/types/ServiceResult";
import { AxiosError } from "axios";

export default function CreateAppointment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);

  const formFields: FormField[] = [
    {
      label: "Date",
      type: "date",
      name: "date",
      placeholder: "Full Name",
      required: true,
      validation: {},
    },
    {
      label: "Patient ID",
      type: "text",
      name: "patientId",
      placeholder: "Patient ID",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 30,
      },
    },
    {
      label: "Doctor ID",
      type: "number",
      name: "doctorId",
      placeholder: "Doctor ID",
      required: true,
      validation: {
        minLength: 1,
        maxLength: 10,
      },
    },
  ];

  const createAppointmentMutation = useMutation<
    ServiceResult<Appointment>,
    unknown,
    CreateAppointmentRequest
  >({
    mutationFn: (createAppointmentRequest: CreateAppointmentRequest) =>
      createAppointment(createAppointmentRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.push("/appointments");
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
        Create Appointment
      </Typography>
      <Typography mb={2}>Bu sayfa yapım aşamasında</Typography>
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
          mutate: createAppointmentMutation.mutate,
          error: createAppointmentMutation.error,
          data: createAppointmentMutation.data,
        }}
        formFields={formFields}
      />
    </>
  );
}
