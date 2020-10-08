/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Container } from '@material-ui/core';

import PropTypes from 'prop-types';

const ContentContainer = ({ children, maxWidth }) => {
  return (
    <>
      <Container maxWidth={maxWidth}>{children}</Container>
    </>
  );
};

ContentContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']).isRequired,
};

export default ContentContainer;
