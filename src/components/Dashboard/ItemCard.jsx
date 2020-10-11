/* eslint-disable react/prop-types */ // TODO: Prop Types
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from '@material-ui/core';

import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ItemCard = ({ product }) => {
  const { t } = useTranslation();

  const beautifyPrice = (price) => {
    let num = Number(price);
    let res = num.toString();
    res = res.split('.');
    if (res.length === 1 || res[1].length < 3) {
      num = num.toFixed(2);
    }

    let beautifiedPrice = num.toString();
    beautifiedPrice = beautifiedPrice.replace('.', ',') + '€';
    return beautifiedPrice;
  };

  return (
    <GridItem item>
      <ProductCard>
        <ProductCardMedia image={product.imgUrl} />
        <ProductTitleBox>
          <Typography variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography align="right" variant="h6" color="textSecondary" component="p">
            {beautifyPrice(product.price)}
          </Typography>
        </ProductTitleBox>
        <CardActions>
          <ReserveButton
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingBasketIcon />}
          >
            {t('Button.Reserve')}
          </ReserveButton>
        </CardActions>
      </ProductCard>
    </GridItem>
  );
};

// TODO: Fixed Size!!!

const GridItem = styled(Grid)`
  width: 100%;

  ${(props) => props.theme.breakpoints.up('md')} {
    width: 50%;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 33.333333%;
  }
`;

const ProductCard = styled(Card)``;
const ProductCardMedia = styled(CardMedia)`
  min-height: 300px;
`;

const ProductTitleBox = styled(CardContent)``;

const ReserveButton = styled(Button)`
  margin-left: auto !important;
`;

export default ItemCard;
