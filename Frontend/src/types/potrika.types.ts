export interface Potrika {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface PotrikaHeaderResponse {
  potrika: Potrika;
}
