import type { Gender, User } from "./user.types";

export interface ProfileHeaderData {
  user: User;
}

export interface UpdateGeneralData {
  fullName?: string;
  bio?: string;
  phoneNumber?: string;
  gender?: Gender;
}
