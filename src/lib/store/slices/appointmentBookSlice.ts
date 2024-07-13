import { ClinicModel } from "@/lib/api/clinicAPI";
import { DentistModel } from "@/lib/api/dentistAPI";
import { ServiceModel } from "@/lib/api/serviceAPI";
import { StateCreator } from "zustand";

export type AppointmentBookState = {
  clinic: ClinicModel | undefined;
  service: ServiceModel | undefined;
  dentist: DentistModel | undefined;
};

export type AppointmentBookActions = {
  setClinic: (clinic: ClinicModel) => void;
  setService: (service: ServiceModel) => void;
  setDentist: (dentist: DentistModel) => void;
};

export type AppointmentBookSlice = AppointmentBookState &
  AppointmentBookActions;

export const createAppointmentBookSlice: StateCreator<
  AppointmentBookSlice,
  [],
  [],
  AppointmentBookSlice
> = (set) => ({
  clinic: undefined,
  service: undefined,
  dentist: undefined,

  setClinic: (clinic: ClinicModel) => set((state) => ({ clinic: clinic })),
  setService: (service: ServiceModel) => set((state) => ({ service: service })),
  setDentist: (dentist: DentistModel) => set((state) => ({ dentist: dentist })),
});
