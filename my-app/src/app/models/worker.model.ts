export interface Worker {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  jobType: string;
  experience: number;
  location: string;
  description?: string;
  createdAt?: string;
}