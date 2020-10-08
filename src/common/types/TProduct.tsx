export type TProduct = {
  id: number;
  name: string;
  description: string;
  vendor: string;
  link: string;
  price: number;
  imgUrl: string;
  isReserved: boolean;
  reservedBy?: string;
};
