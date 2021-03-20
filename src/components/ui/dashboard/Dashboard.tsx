import React, { Component } from 'react';
import jsLogger from 'js-logger';

import FirebaseService from 'services/firebase/FirebaseService';

import DashboardContent from './DashboardContent';
import HeaderBar from './HeaderBar';
import AddProductDialog from 'components/ui/dialogs/AddProductForm/AddProductDialog';
import DashboardActions from './DashboardActions';

import { Container } from '@material-ui/core';
import { Product } from 'types/data/productType';

interface DashboardProps {}
interface DashboardState {
  products: Product[];
  isLoading: boolean;
  initialized: boolean;
  dialogStates: {
    addDialog: {
      open: boolean;
    };
  };
}
export default class Dashboard extends Component<DashboardProps, DashboardState> {
  /*
  TODO:
    - Add empty "nothin is here" component if no products are present

  */

  private log = jsLogger.get('Dashboard');

  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      products: [],
      initialized: false,
      isLoading: false,
      dialogStates: {
        addDialog: {
          open: false,
        },
      },
    };

    this.handleAddDialogClose = this.handleAddDialogClose.bind(this);
    this.handleAddDialogOpen = this.handleAddDialogOpen.bind(this);
  }

  componentWillUnmount(): void {
    this.setState({
      products: [],
      initialized: false,
      isLoading: false,
    });
  }

  componentDidMount(): void {
    this.log.debug(`Initializing`);
    this.setState({ isLoading: true });

    FirebaseService.getProductsOnce()
      .then((arr) => {
        arr && this.setState({ products: arr });
        this.log.debug(`Successfully fetched ${arr.length} products.`);
        this.log.debug(arr);
        this.setState({ initialized: true });
      })
      .catch((err) => {
        this.log.error(err.message);
      });
    this.setState({ isLoading: false });
  }

  // TODO: Maybe to toggle?
  handleAddDialogClose(): void {
    this.log.debug('Closed AddProductDialog');
    this.setState({ dialogStates: { addDialog: { open: false } } });
  }

  handleAddDialogOpen(): void {
    this.log.debug('Opened AddProductDialog');
    this.setState({ dialogStates: { addDialog: { open: true } } });
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <AddProductDialog
          isOpen={this.state.dialogStates.addDialog.open}
          handleClose={this.handleAddDialogClose}
        />
        <HeaderBar />
        <Container maxWidth="md">
          <DashboardContent
            initialized={this.state.initialized}
            productIDs={this.state.products.map((x) => {
              return x.id;
            })}
          />
        </Container>
        <DashboardActions openAddHandler={this.handleAddDialogOpen} />
      </React.Fragment>
    );
  }
}
