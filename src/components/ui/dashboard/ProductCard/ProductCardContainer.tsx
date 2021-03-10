import { Card, Grid } from '@material-ui/core';
import React from 'react';

import grey from '@material-ui/core/colors/grey';

interface CardContainerProps {
  children?: React.ReactNode;
  isPrefill?: boolean;
}

export default function ProductCardContainer(props: CardContainerProps): JSX.Element {
  const isPrefill = () => {
    if (props.isPrefill)
      return (
        <Card style={{ backgroundColor: grey[200] }} variant="outlined">
          {props.children}
        </Card>
      );
    return <Card>{props.children}</Card>;
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} md={4}>
        {isPrefill()}
      </Grid>
    </React.Fragment>
  );
}
