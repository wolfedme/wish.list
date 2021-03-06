export interface Product {
  id: number;
  name: string;
  isReserved: boolean;
  description?: string;
  price?: number;
  vendor?: string;
  imgUrl?: string;
  link?: string;
}
