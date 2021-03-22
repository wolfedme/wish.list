import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { Product } from 'types/data/productType';

interface CardContentProps {
  isLoading?: boolean;
  product: Product;
}

export default function ProductCardContent(props: CardContentProps): JSX.Element {
  const productDisplay = () => {
    return (
      <div>
        <p>Name: {props.product.name}</p>
        <p>Reserved: {props.product.isReserved.toString()}</p>
      </div>
    );
  };

  return (
    <div>
      {props.isLoading && <CircularProgress />}
      {props.product && props.product.name !== 'undef' && productDisplay()}
    </div>
  );
}
