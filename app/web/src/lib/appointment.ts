import { User } from "@prisma/client";

export interface ViewableAppointment {
  id: number;
  clientUser: Partial<User>;
  professionalUser: Partial<User>;
  time: Date;
}
