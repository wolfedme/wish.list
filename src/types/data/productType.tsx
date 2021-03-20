export interface Product {
  id: string;
  name: string;
  isReserved: boolean;
  description?: string;
  price?: number;
  vendor?: string;
  imgUrl?: string;
  link?: string;
}

export interface Currency {
  id: number;
  value: string;
  label: string;
}
