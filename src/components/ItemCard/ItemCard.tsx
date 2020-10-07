import React from 'react';
import PropTypes from 'prop-types';
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

import { TProduct } from '../../common/TProduct';

const ItemCard = (product: TProduct, { imgHeight = 200 }) => {
  const { t } = useTranslation();

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
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
          <ReserveButton size="large" color="primary" variant="contained">
            {t('button.reserve')}
          </ReserveButton>
        </CardActions>
      </Card>
    </>
  );
};

ItemCard.defaultProps = {
  imgHeight: 300, // TODO: Height by screen size?
};

ItemCard.propTypes = {
  imgHeight: PropTypes.number,
};

const ReserveButton = styled(Button)`
  margin-left: auto;
`;

const PriceTag = styled(Fab)`
  position: absolute;
  margin: 10px;
  right: 0;
`;

export default ItemCard;
