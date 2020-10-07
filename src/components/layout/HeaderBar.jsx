import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const HeaderBar = ({ title }) => {
  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

HeaderBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeaderBar;
