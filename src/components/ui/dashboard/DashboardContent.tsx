import { Grid } from '@material-ui/core';
import React from 'react';
import ProductCard from './ProductCard/ProductCard';
import ProductCardContainer from './ProductCard/ProductCardContainer';
import ProductCardContent from './ProductCard/ProductCardContent';

import * as convars from 'configs/convars.json';
import { Product } from 'types/data/productType';

interface DashboardContentProps {
  productIDs: number[];
}

export default function DashboardContent(props: DashboardContentProps): JSX.Element {
  const skeletonFill = () => {
    const filler: Product = {
      id: 0,
      name: 'undef',
      isReserved: true,
    };

    const times = Array.from(Array(convars.dashboard.initial_fill_size).keys());

    return (
      <React.Fragment>
        {times.map((key) => {
          return (
            <ProductCardContainer isPrefill={true} key={key}>
              <ProductCardContent isLoading={true} product={filler} key={key}></ProductCardContent>
            </ProductCardContainer>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: '25px' }} />
      <Grid container spacing={4}>
        {props.productIDs.length === 0 && skeletonFill()}
        {props.productIDs.map((x) => {
          return <ProductCard productID={x} key={x} />;
        })}
      </Grid>
    </React.Fragment>
  );
}
