import { AppBar, Toolbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

interface HeaderBarProps {
  isLoggedIn?: boolean;
  handler: {
    toggleLoginHandler(): void;
    logoutHandler(): void;
  };
}

const useStyles = makeStyles((theme) => ({
  loginButton: {
    marginLeft: 'auto',
  },
}));

export default function HeaderBar(props: HeaderBarProps): JSX.Element {
  const classes = useStyles();
  // TODO: Changeable title
  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Wishlist
          </Typography>
          {props.isLoggedIn ? (
            <Button
              color="secondary"
              variant={'outlined'}
              className={classes.loginButton}
              onClick={() => {
                props.handler.logoutHandler();
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              className={classes.loginButton}
              onClick={() => {
                props.handler.toggleLoginHandler();
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
