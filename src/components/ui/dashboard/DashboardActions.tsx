import Fab from '@material-ui/core/Fab';
import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

interface DashboardActionsProps {
  openAddHandler(): void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    addFab: {
      top: 'auto',
      right: 20,
      bottom: 20,
      margin: 0,
      left: 'auto',
      position: 'fixed',
    },
  }),
);

function AddFab(props: { openAddHandler(): void; className: string | undefined }) {
  return (
    <Fab
      color="primary"
      aria-label="add"
      className={props.className}
      size="large"
      onClick={() => props.openAddHandler()}
    >
      <AddIcon />
    </Fab>
  );
}

export default function DashboardActions(props: DashboardActionsProps): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      <AddFab openAddHandler={props.openAddHandler} className={classes.addFab}></AddFab>
    </div>
  );
}
