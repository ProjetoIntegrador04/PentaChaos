/**
 * Types para Squad
 * Compatível com backend (SquadResponse.java)
 */

export interface RoleInfo {
  id: number;
  name: string;
}

export interface UserBasicInfo {
  id: number;
  username: string;
  fullName?: string;
  email: string;
  ra?: string;
  squadRole?: string; // Função na Squad (P.O, Desenvolvedor, Scrum Master, etc)
  roles?: RoleInfo[];
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

export interface UpdateMemberRoleRequest {
  squadRole: string;
}
