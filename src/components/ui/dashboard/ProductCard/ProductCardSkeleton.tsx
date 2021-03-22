import Card from '@material-ui/core/Card';
import React from 'react';

import grey from '@material-ui/core/colors/grey';

interface ProductCardSkeletonInterface {
  children?: React.ReactNode;
}

export default function ProductCardSkeleton(props: ProductCardSkeletonInterface): JSX.Element {
  return (
    <Card style={{ backgroundColor: grey[200] }} variant="outlined">
      {props.children}
    </Card>
  );
}
