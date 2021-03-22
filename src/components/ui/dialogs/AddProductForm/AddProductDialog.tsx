import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';

import currencies from 'types/data/currencies';

import { Product } from 'types/data/productType';

import jsLogger from 'js-logger';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

import LayersIcon from '@material-ui/icons/Layers';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import Grid from '@material-ui/core/Grid';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import FirebaseService from 'services/firebase/FirebaseService';

interface AddProductDialogProps {
  isOpen: boolean;
  handleClose(): void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    modalTitleWithIcon: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  }),
);

// TODO: To Class Component

// TODO: Products get pushed to wrong path

export default function AddProductModal(props: AddProductDialogProps): JSX.Element {
  const log = jsLogger.get('AddProductDialog');

  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(currencies[0].value);
  const [confirmLeaveOpen, setConfirmLeave] = useState(false);

  // Form Inputs
  const [nameValue, setNameValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [linkValue, setLinkValue] = useState('');
  const [imageValue, setImageValue] = useState('');

  async function sendChanges(product: Product): Promise<Product> {
    return await FirebaseService.addItem(product)
      .then((x) => {
        log.debug(`sendChanges: Service successfully added product ${x.name}`);
        return Promise.resolve(product);
      })
      .catch((x: Error) => {
        log.error(`sendChanges: Failed sending product: ${x.message}`);
        return Promise.reject(x);
      });
  }

  // TODO: Check for empty textfields
  // TODO: Validate textfields
  function sendChangesHandler(): void {
    setLoading(true);
    const product: Product = {
      id: 0,
      name: nameValue,
      price: Number(priceValue),
      isReserved: false,
    };

    descriptionValue !== '' && (product.description = descriptionValue);
    linkValue !== '' && (product.link = linkValue);
    imageValue !== '' && (product.imgUrl = imageValue);

    log.debug('Parsed product: ');
    log.debug(product);

    sendChanges(product)
      .then((x: Product) => {
        log.debug(`Successfully added product ${x.name}`);
      })
      .catch((x: Error) => {
        log.debug(`Handler: sendChanges failed with ${x.message}`);
      })
      .finally(() => {
        setLoading(false);
        closeDialog();
      });
  }

  function toggleLeaveDialog(): void {
    !isLoading ? setConfirmLeave(!confirmLeaveOpen) : setConfirmLeave(false);
  }

  function closeDialog(): void {
    setConfirmLeave(false);
    setNameValue('');
    setPriceValue('');
    setDescriptionValue('');
    setLinkValue('');
    setImageValue('');
    props.handleClose();
  }

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };

  const nameTextfield = () => {
    return (
      <TextField
        required
        id="name-textfield"
        label="Name"
        placeholder="Playstation 5"
        variant="outlined"
        fullWidth
        value={nameValue}
        onChange={(x) => setNameValue(x.target.value)}
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LayersIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const pricePicker = () => {
    return (
      <TextField
        select
        value={currency}
        onChange={handleCurrencyChange}
        variant="standard"
        disabled={isLoading}
      >
        {currencies.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  // TODO: Only accept numbers
  const priceTextfield = () => {
    return (
      <TextField
        required
        id="price-textfield"
        label="Price"
        placeholder="499,95"
        variant="outlined"
        fullWidth
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MonetizationOnIcon />
            </InputAdornment>
          ),
          endAdornment: <InputAdornment position="end">{pricePicker()}</InputAdornment>,
        }}
      />
    );
  };

  const descriptionTextfield = () => {
    return (
      <TextField
        id="description-textfield"
        label="Description (optional)"
        variant="outlined"
        multiline
        rows="5"
        rowsMax="5"
        fullWidth
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const linkTextfield = () => {
    return (
      <TextField
        required
        id="link-textfield"
        variant="outlined"
        label="Link (optional)"
        fullWidth
        disabled={isLoading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const uploadImageTextfield = () => {
    return (
      <TextField
        label="Upload Image (optional)"
        defaultValue="TODO"
        variant="outlined"
        fullWidth
        disabled
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ImageIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const confirmLeaveDialog = () => {
    return (
      <Dialog open={confirmLeaveOpen} onClose={() => toggleLeaveDialog()}>
        <DialogTitle>
          <div className={classes.modalTitleWithIcon}>
            <CancelIcon style={{ marginRight: '10px' }} /> <span>Confirm leave</span>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to close without saving? All of your changes will be lost!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleLeaveDialog()} color="primary">
            Go back
          </Button>
          <Button onClick={() => closeDialog()} color="primary" autoFocus>
            Discard changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // TODO: Abstraction for reusability with e.g. edit dialog

  return (
    <React.Fragment>
      <Dialog open={props.isOpen} onClose={() => toggleLeaveDialog()}>
        {confirmLeaveDialog()}
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <DialogTitle>
              <div className={classes.modalTitleWithIcon}>
                <AddIcon style={{ marginRight: '10px' }} /> <span>Add product</span>
              </div>
            </DialogTitle>
          </Box>
          <Box>
            <IconButton onClick={() => toggleLeaveDialog()} disabled={isLoading}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Required
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {nameTextfield()}
              </Grid>
              <Grid item xs={4}>
                {priceTextfield()}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Optional
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {linkTextfield()}
              </Grid>
              <Grid item xs={12}>
                {descriptionTextfield()}
              </Grid>
              <Grid item xs={12}>
                {uploadImageTextfield()}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            size="large"
            startIcon={<DeleteIcon />}
            onClick={() => toggleLeaveDialog()}
            disabled={isLoading}
          >
            Discard
          </Button>
          <Button
            variant={!isLoading ? 'contained' : 'outlined'}
            color="primary"
            size="large"
            startIcon={!isLoading ? <SaveIcon /> : <CircularProgress size={24} />}
            onClick={() => {
              !isLoading && sendChangesHandler();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
