
export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  assignedProfileId?: string;
}

export interface CoupleProfile {
  id: string;
  name: string;
  createdBy: string;
  startDate: Date;
  customTitle?: string;
  assignedUserId?: string;
  generatedPassword?: string;
  imageUrl?: string;
}
