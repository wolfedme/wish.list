import { Grid } from '@material-ui/core';
import React from 'react';
import ProductCard from './ProductCard/ProductCard';

import * as convars from 'configs/convars.json';
import { Product } from 'types/data/productType';

interface DashboardContentProps {
  products: Product[];
  initialized: boolean;
  handler: {
    cardHandler: {
      reserve(product: Product): Promise<Product>;
      unReserve(product: Product): Promise<Product>;
    };
  };
}

//TODO: New cards are not referenced nor updated
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
        {times.map((key, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <ProductCard
                product={filler}
                isSkeleton
                key={key}
                handler={props.handler.cardHandler}
              />
            </Grid>
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
        {!props.products.length && props.initialized && emptyContent()}
        {props.products.map((x, i) => {
          return (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <ProductCard product={x} key={i} handler={props.handler.cardHandler} />
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
}
