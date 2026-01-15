import type { Gender, User } from "./user.types";

export interface ProfileHeaderData {
  user: User;
  meta: {
    isOwnProfile: boolean;
  };
}

export interface UpdateGeneralData {
  fullName?: string;
  phoneNumber?: string;
  gender?: Gender;
  religion?: string;
  dateOfBirth?: string;
}
