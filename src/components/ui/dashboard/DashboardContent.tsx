import { Grid } from '@material-ui/core';
import React from 'react';
import ProductCard from './ProductCard/ProductCard';
import ProductCardContainer from './ProductCard/ProductCardContainer';
import ProductCardContent from './ProductCard/ProductCardContent';

import * as convars from 'configs/convars.json';
import { Product } from 'types/data/productType';

interface DashboardContentProps {
  productIDs: number[];
  initialized: boolean;
}

export default function DashboardContent(props: DashboardContentProps): JSX.Element {
  const skeletonFill = () => {
    //TODO: To component
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

  const emptyContent = () => {
    //TODO
    return <p>empty</p>;
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: '25px' }} />
      <Grid container spacing={4}>
        {!props.initialized && skeletonFill()}
        {props.productIDs.length === 0 && props.initialized && emptyContent()}
        {props.productIDs.map((x) => {
          return <ProductCard productID={x} key={x} />;
        })}
      </Grid>
    </React.Fragment>
  );
}
