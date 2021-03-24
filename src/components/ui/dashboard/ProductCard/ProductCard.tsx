import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import grey from '@material-ui/core/colors/grey';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useState } from 'react';
import FirebaseService from 'services/firebase/FirebaseService';
import { Product } from 'types/data/productType';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Chip from '@material-ui/core/Chip';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

interface ProductCardProps {
  isSkeleton?: boolean;
  product: Product;
  handler: {
    reserve(product: Product): Promise<Product>;
    unReserve(product: Product): Promise<Product>;
  };
}

// TODO: Limit title-length in add dialogue
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 'auto',
    },
    title: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    reserveButton: {
      marginLeft: 'auto',
    },
  }),
);

export default function ProductCard(props: ProductCardProps): JSX.Element {
  const classes = useStyles();
  const userID = FirebaseService.getUser();

  const [buttonLoading, setButtonLoading] = useState(false);

  function handleReserve() {
    setButtonLoading(true);
    props.handler
      .reserve(props.product)
      .then()
      .catch()
      .finally(() => setButtonLoading(false));
  }

  function handleUnreserve() {
    setButtonLoading(true);
    props.handler
      .unReserve(props.product)
      .then()
      .catch()
      .finally(() => setButtonLoading(false));
  }

  // TODO: Color-code cards by category

  const cardHeader = () => {
    //TODO: Implement - category, etc.
    return (
      <CardHeader
        title={
          props.isSkeleton ? (
            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
          ) : (
            props.product.name
          )
        }
        className={classes.title}
      />
    );
  };

  const cardMedia = () => {
    //TODO: If no imgURL, display placeholder
    const placeholderURL = 'https://i.stack.imgur.com/y9DpT.jpg';
    const imgUrl =
      props.product.imgUrl && props.product.imgUrl !== '' ? props.product.imgUrl : placeholderURL;
    return props.isSkeleton ? (
      <Skeleton animation="wave" variant="rect" className={classes.media} />
    ) : (
      <CardMedia className={classes.media} image={imgUrl} title={props.product.name} />
    );
  };

  const cardContent = () => {
    // TODO: Description hier hin
    return (
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.isSkeleton ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : props.product.description ? (
            props.product.description
          ) : (
            ''
          )}
        </Typography>
      </CardContent>
    );
  };

  const cardAction = () => {
    // TODO: Loading Button

    const price = () => {
      let priceStr = 'Unknown price';
      if (props.product.price) priceStr = props.product.price + ' ' + props.product.currency?.value;
      return (
        <Chip
          color={props.product.price ? 'primary' : 'default'}
          icon={<LocalOfferIcon />}
          label={priceStr}
        />
      );
    };

    const reservedByUser = () => {
      return props.product.reservedBy && props.product.reservedBy === userID;
    };

    const reserveButton = () => {
      if (reservedByUser()) {
        return (
          <Button
            className={classes.reserveButton}
            variant="outlined"
            color="secondary"
            disableElevation
            onClick={() => handleUnreserve()}
            disabled={buttonLoading}
            size="large"
            startIcon={<RotateLeftIcon />}
          >
            Undo Reservation
          </Button>
        );
      }

      if (props.product.isReserved && !reservedByUser())
        return (
          <Button
            variant="contained"
            className={classes.reserveButton}
            size="large"
            color="primary"
            disableElevation
            disabled
            startIcon={<RemoveCircleOutlineIcon />}
          >
            Taken
          </Button>
        );

      return (
        <Button
          variant="contained"
          className={classes.reserveButton}
          color="primary"
          disableElevation
          onClick={() => handleReserve()}
          size="large"
          disabled={buttonLoading}
          startIcon={<CheckCircleIcon />}
        >
          Reserve
        </Button>
      );
    };

    if (props.isSkeleton)
      return (
        <CardActions disableSpacing>
          <Skeleton variant="rect" width={130} height={42} />
          <Skeleton style={{ marginLeft: 'auto' }} variant="rect" width={130} height={42} />
        </CardActions>
      );

    return (
      <CardActions disableSpacing>
        {price()}
        {reserveButton()}
      </CardActions>
    );
  };

  const cardWrapper = () => {
    return (
      <Card className={classes.root} variant={'elevation'}>
        {cardHeader()}
        {cardMedia()}
        {cardContent()}
        {cardAction()}
      </Card>
    );
  };

  return <React.Fragment>{props.product && cardWrapper()}</React.Fragment>;
}
