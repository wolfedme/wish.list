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

    // Setup onChildChange
    const ref = FirebaseService.fetchWholeReference();
    ref.on('child_added', (x) => {
      const value: Product = x.val() as Product;
      this.log.debug('child_added ', value);
      this.setState({ products: [...this.state.products, value] });
      //TODO: Animate Card in
    });

    ref.on('child_changed', (x) => {
      const value: Product = x.val() as Product;
      this.log.debug('child_changed ', value);
      this.log.warn('TODO: Implement child_changed');
    });

    ref.on('child_removed', (x) => {
      const value: Product = x.val() as Product;
      this.log.debug('child_removed ', value);
      this.log.warn('TODO: Implement child_removed');
    });

    this.setState({ isLoading: false });
  }

  componentWillUnmount(): void {
    const ref = FirebaseService.fetchWholeReference();

    ref.off();
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
          <DashboardContent initialized={this.state.initialized} products={this.state.products} />
        </Container>
        <DashboardActions openAddHandler={this.handleAddDialogOpen} />
      </React.Fragment>
    );
  }
}
