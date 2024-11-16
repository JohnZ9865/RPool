export const USER_COLLECTION = "users";

export const getUserCollection = (id: string) => `${USER_COLLECTION}/${id}`;

export enum YearEnum {
  FRESHMAN = 1,
  SOPHOMORE = 2,
  JUNIOR = 3,
  SENIOR = 4,
}

export interface UserDocumentObject {
  id: string;
  name: string;
  email: string;
  major: string;
  year: YearEnum;
  profilePictureUrl: string;
}