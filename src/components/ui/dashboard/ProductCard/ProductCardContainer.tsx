import { Card, Grid } from '@material-ui/core';
import React from 'react';

import ProductCardSkeleton from './ProductCardSkeleton';

import grey from '@material-ui/core/colors/grey';

interface CardContainerProps {
  children?: React.ReactNode;
  isSkeleton?: boolean;
}

export default function ProductCardContainer(props: CardContainerProps): JSX.Element {
  const isPrefill = () => {
    if (props.isSkeleton) return <ProductCardSkeleton>{props.children}</ProductCardSkeleton>;
    return <Card>{props.children}</Card>;
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} md={4}>
        {isPrefill()}
      </Grid>
    </React.Fragment>
  );
}
