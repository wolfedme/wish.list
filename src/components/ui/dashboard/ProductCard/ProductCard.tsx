import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
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
import Skeleton from '@material-ui/lab/Skeleton';
import BusinessIcon from '@material-ui/icons/Business';
import grey from '@material-ui/core/colors/grey';

import jsLogger from 'js-logger';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

interface ProductCardProps {
  isSkeleton?: boolean;
  product: Product;
  handler: {
    toggleReserve(product: Product): Promise<Product>;
  };
}

// TODO: Expand/collapse for title & description
// TODO: Limit title length in ProductDialogue
// TODO: Confirm reserve/unreserve
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 'auto',
    },
    title: {
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowX: 'hidden',
      overflowY: 'auto',
      textOverflow: 'ellipsis',
      height: '96px',
    },
    media: {
      height: '250px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
    },
    priceTag: {
      marginTop: '8px',
      marginRight: '8px',
      fontSize: '1rem',
      borderRadius: '4px',
    },
    descriptionText: {
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowX: 'hidden',
      overflowY: 'auto',
      textOverflow: 'ellipsis',
      height: '106px',
    },
    reserveButton: {
      marginLeft: 'auto',
    },
  }),
);

export default function ProductCard(props: ProductCardProps): JSX.Element {
  const classes = useStyles();
  const userID = FirebaseService.getUser();

  const log = jsLogger.get(`productCard #${props.product.id}`);

  const [buttonLoading, setButtonLoading] = useState(false);

  function handleToggleReserve() {
    log.debug('Started toggle');
    setButtonLoading(true);
    props.handler
      .toggleReserve(props.product)
      .catch((x) => {
        log.debug('Error while toggling: ', x.message);
      })
      .finally(() => {
        setButtonLoading(false);
        log.debug('Finalized toggle');
      });
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
        action={
          !props.isSkeleton &&
          process.env.NODE_ENV === 'development' && (
            <Tooltip title={props.product.id} placement="top">
              <IconButton aria-label="settings">
                <InfoIcon />
              </IconButton>
            </Tooltip>
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
    const price = () => {
      let priceStr = 'Unknown price';
      if (props.product.price) priceStr = props.product.price + ' ' + props.product.currency?.value;
      return (
        <Chip
          className={classes.priceTag}
          color={props.product.price ? 'primary' : 'default'}
          icon={<LocalOfferIcon />}
          label={priceStr}
        />
      );
    };

    return props.isSkeleton ? (
      <Skeleton animation="wave" variant="rect" className={classes.media} />
    ) : (
      <CardMedia className={classes.media} image={imgUrl} title={props.product.name}>
        {price()}
      </CardMedia>
    );
  };

  const cardContent = () => {
    return (
      <CardContent>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          noWrap
          className={classes.descriptionText}
        >
          {props.isSkeleton ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : props.product.description ? (
            props.product.description
          ) : (
            'No description given.'
          )}
        </Typography>
      </CardContent>
    );
  };

  const cardAction = () => {
    // TODO: Loading Button

    const reservedByUser = () => {
      return props.product.reservedBy && props.product.reservedBy === userID;
    };

    // TODO: Simplify
    const reserveButton = () => {
      if (reservedByUser()) {
        return (
          <Button
            className={classes.reserveButton}
            variant="outlined"
            color="secondary"
            disableElevation
            onClick={() => handleToggleReserve()}
            disabled={buttonLoading}
            size="large"
            startIcon={!buttonLoading ? <RotateLeftIcon /> : <CircularProgress size={24} />}
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
          variant={!buttonLoading ? 'contained' : 'outlined'}
          className={classes.reserveButton}
          color="primary"
          disableElevation
          onClick={() => handleToggleReserve()}
          size="large"
          disabled={buttonLoading}
          startIcon={!buttonLoading ? <CheckCircleIcon /> : <CircularProgress size={24} />}
        >
          Reserve
        </Button>
      );
    };

    const linkButton = () => {
      const disabled = !props.product.link || props.product.link === '';
      return (
        <Button disabled={disabled} startIcon={<BusinessIcon />}>
          Website
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
        {linkButton()}
        {reserveButton()}
      </CardActions>
    );
  };

  // TODO: Different display if reserved by current user

  const cardWrapper = () => {
    return (
      <Card
        className={classes.root}
        variant={props.product.isReserved ? 'outlined' : 'elevation'}
        style={props.product.isReserved ? { backgroundColor: grey[200] } : undefined}
      >
        {cardHeader()}
        {cardMedia()}
        {cardContent()}
        {cardAction()}
      </Card>
    );
  };

  return <React.Fragment>{props.product && cardWrapper()}</React.Fragment>;
}
