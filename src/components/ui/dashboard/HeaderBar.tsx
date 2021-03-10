import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

interface HeaderBarProps {}

export default function HeaderBar(props: HeaderBarProps): JSX.Element {
  return (
    <React.Fragment>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Wishlist
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
