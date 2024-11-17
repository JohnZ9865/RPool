export const USER_COLLECTION = "users";

export const getUserCollection = (id: string) => `${USER_COLLECTION}/${id}`;

export enum YearEnum {
  FRESHMAN = "Freshman",
  SOPHOMORE = "Sophomore",
  JUNIOR = "Junior",
  SENIOR = "Senior",
}

export interface UserDocumentObject {
  id: string;
  name: string;
  email: string;
  major: string;
  year: YearEnum;
  profilePictureUrl: string;
}
