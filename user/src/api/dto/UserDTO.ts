// user\src\api\dto\UserDTO.ts

import { User } from "@nihil_backend/root/user/src/core/entities/User";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export function toUserDTO(entity: User): UserDTO {
  return {
    id: entity.id,
    username: entity.username,
    email: entity.email,
    displayName: entity.displayName,
    avatarUrl: entity.avatarUrl,
  };
}
