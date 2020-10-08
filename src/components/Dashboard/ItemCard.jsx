/* eslint-disable react/prop-types */ // TODO: Prop Types
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

const ItemCard = ({ product, imgHeight = 200 }) => {
  const { t } = useTranslation();

  // TODO: Change Price Tag to "available / not available and move price elsewhere"

  // TODO: Crop Description with read-more

  return (
    <>
      <StyledCard>
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
          <FixedContentHeight>
            <Typography gutterBottom variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" color="textPrimary" component="p">
              {product.description}
            </Typography>
          </FixedContentHeight>
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
      </StyledCard>
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

const StyledCard = styled(Card)`
  width: 500px;
`; // TODO: Full Width on Mobile, not full on Desktop

const FixedContentHeight = styled(CardContent)`
  height: 200px;
  overflow-y: hidden;
`;

export default ItemCard;
