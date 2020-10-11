/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Typography, Grid, Container } from '@material-ui/core';
import ItemCard from './ItemCard';

const ItemGrid = ({ products, spacing = 5 }) => {
  if (products.length === undefined || products === null || products.length <= 0) {
    return <Typography>No items found!</Typography>;
  }
  return (
    <Container maxWidth={false}>
      <Grid
        container
        spacing={spacing}
        justify="center"
        alignItems="flex-start"
        style={{
          margin: 0,
          width: '100%',
        }}
      >
        {products.map((x, id) => {
          return <ItemCard key={id} product={x} />;
        })}
      </Grid>
    </Container>
  );
};

export default ItemGrid;
