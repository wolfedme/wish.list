/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import ProductGridItem from './ProductGridItem';

const ProductGrid = ({ products, spacing = 5 }) => {
  if (products.length === undefined || products === null || products.length <= 0) {
    return <Typography>No items found!</Typography>;
  }
  return (
    <Grid container spacing={spacing} justify="center" alignItems="flex-start">
      {products.map((x, id) => {
        return <ProductGridItem key={id} product={x} />;
      })}
    </Grid>
  );
};

export default ProductGrid;
