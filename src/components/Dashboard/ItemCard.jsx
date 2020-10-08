import React from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Fab,
} from '@material-ui/core';

import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ItemCard = (product, { imgHeight = 200 }) => {
  const { t } = useTranslation();

  // TODO: Change Price Tag to "available / not available and move price elsewhere"

  return (
    <>
      <Card>
        <CardActionArea>
          <PriceTag color="secondary" size="large">
            <Typography variant="h6">{product.price}€</Typography>
          </PriceTag>
          <CardMedia
            component="img"
            alt={product.name}
            height={imgHeight}
            image={product.imgUrl}
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textPrimary" component="p">
              {product.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
          <Button size="small" color="primary">
            {t('button.todo')}
          </Button>
          <Button size="small" color="primary">
            {t('button.todo')}
          </Button>
          <ReserveButton
            size="large"
            color="primary"
            variant="contained"
            disabled={product.isReserved}
          >
            {product.isReserved ? t('button.isReserved') : t('button.reserve')}
          </ReserveButton>
        </CardActions>
      </Card>
    </>
  );
};

// TODO: Fixed Size!!!

const ReserveButton = styled(Button)`
  margin-left: auto;
`;

const PriceTag = styled(Fab)`
  position: absolute;
  margin: 10px;
  right: 0;
`;

export default ItemCard;
