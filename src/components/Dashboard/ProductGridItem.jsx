/* eslint-disable react/prop-types */ // TODO: Prop Types
import React from 'react';

import { Grid } from '@material-ui/core';
import ItemCard from './ItemCard';

const ProductGridItem = ({ product }) => {
  return (
    <Grid item>
      <ItemCard product={product} imgHeight={150} />
    </Grid>
  );
};

export default ProductGridItem;
