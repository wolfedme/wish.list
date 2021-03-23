export interface Product {
  id: number;
  name: string;
  isReserved: boolean;
  reservedBy?: string;
  description?: string;
  price?: number;
  currency?: Currency;
  vendor?: string;
  imgUrl?: string;
  link?: string;
  tags?: string[];
  category?: string;
}

export interface Currency {
  id: number;
  value: string;
  label: string;
}
