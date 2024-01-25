import { User } from "@prisma/client";

export interface ViewableAppointment {
  id: number;
  clientUser: Partial<User> | null;
  professionalUser: Partial<User> | null;
  time: Date;
}
