import React from 'react';
import { Product } from 'types/data/productType';
import ProductCardContainer from './ProductCardContainer';
import ProductCardContent from './ProductCardContent';
interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

export default function ProductCard(props: ProductCardProps): JSX.Element {
  return (
    <React.Fragment>
      <ProductCardContainer>
        <ProductCardContent isLoading={props.isLoading} product={props.product} />
      </ProductCardContainer>
    </React.Fragment>
  );
}
