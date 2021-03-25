import { DialogTitle } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import React from 'react';

import VpnKeyIcon from '@material-ui/icons/VpnKey';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

interface LoginDialogProps {
  isOpen: boolean;
  closeHandler(): void;
  handleLogin(user: string, pass: string): Promise<void>;
}

export default function LoginDialog(props: LoginDialogProps): JSX.Element {
  const [mail, setMail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loginTextfield = () => {
    return (
      <TextField
        id="email"
        label="E-Mail"
        variant="outlined"
        fullWidth
        type="email"
        placeholder="gordon_freeman@blackmesa.gov"
        onChange={(x) => setMail(x.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const passwordTextfield = () => {
    return (
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        fullWidth
        placeholder="••••••••"
        onChange={(x) => setPassword(x.target.value)}
        type="password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />
    );
  };

  return (
    <React.Fragment>
      <Dialog open={props.isOpen} onClose={() => props.closeHandler()}>
        <DialogTitle>
          <VpnKeyIcon style={{ marginRight: '10px' }} /> <span>Login</span>
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {loginTextfield()}
              </Grid>
              <Grid item xs={12}>
                {passwordTextfield()}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<VpnKeyIcon />}
            onClick={() => {
              props.handleLogin(mail, password).then((x) => {
                props.closeHandler();
              });
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
