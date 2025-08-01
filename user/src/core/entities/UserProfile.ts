// user\src\core\entities\UserProfile.ts

export class UserProfile {
  constructor(
    public id: string,
    public userId: string,
    public bio?: string,
    public location?: string,
    public birthdate?: Date,
    public website?: string,
    public updatedAt?: Date,
  ) {}
}
