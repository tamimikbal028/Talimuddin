export interface PotrikaHeaderResponse {
  potrika: {
    _id: string;
    name: string;
    description?: string;
    avatar?: string;
    coverImage?: string;
    postsCount: number;
    createdAt: string;
    updatedAt: string;
  };
}
