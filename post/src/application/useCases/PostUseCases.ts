// post\src\application\useCases\PostUseCases.ts

import { IPostRepository } from "@nihil_backend/post/src/application/interfaces/IPostRepository";
import { Post } from "@nihil_backend/post/src/core/entities/Post";

export class PostUseCases {
  constructor(private readonly repo: IPostRepository) {}

  getAll(): Promise<Post[]> {
    return this.repo.getAll();
  }
  getById(id: string): Promise<Post | null> {
    return this.repo.getById(id);
  }
  create(data: {
    userId: string;
    content: string;
    mediaUrl?: string | null;
    originalPostId?: string | null;
  }): Promise<Post> {
    return this.repo.create(data);
  }
  update(
    id: string,
    data: Partial<Omit<Post, "id" | "userId">>,
  ): Promise<Post | null> {
    return this.repo.update(id, data);
  }
  delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
