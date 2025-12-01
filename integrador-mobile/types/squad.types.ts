/**
 * Types para Squad
 */

export interface UserBasicInfo {
  id: number;
  username: string;
  fullName?: string;
  email: string;
}

export interface Squad {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  members: UserBasicInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface SquadRequest {
  name: string;
  description?: string;
}

export interface AddMemberRequest {
  userId: number;
}
