export type TClinic = {
  id: number;
  name: string;
  address: string;
  description: string;
  logo?: string;
};

export type TDentist = {
  id: number;
  name: string;
  clinic?: TClinic;
  clinicId?: number;
  image?: string;
};

export type TService = {
  id: number;
  name: string;
  clinic?: TClinic;
  clinicId?: number;
  fee: number;
};
