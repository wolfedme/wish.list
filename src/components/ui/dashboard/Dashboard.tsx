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

  private static log = jsLogger.get('Dashboard');

  private handler = {
    cardHandler: {
      toggleReserve: this.handleToggleReserve,
    },
  };

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
    Dashboard.log.debug(`Initializing`);
    this.setState({ isLoading: true });

    Dashboard.log.debug('Waiting for anonymous sign in');
    FirebaseService.provider.auth.onAuthStateChanged((x) => {
      Dashboard.log.debug('AuthState has changed', x);
      FirebaseService.getProductsOnce()
        .then((arr) => {
          arr && this.setState({ products: arr });
          Dashboard.log.debug(`Successfully fetched ${arr.length} products.`);
          Dashboard.log.debug(arr);
          this.setState({ initialized: true });
        })
        .catch((err) => {
          Dashboard.log.error(err.message);
        });

      // Setup onChildChange
      const ref = FirebaseService.fetchWholeReference();
      ref.on('child_added', (x) => {
        const value: Product = x.val() as Product;
        Dashboard.log.debug('child_added ', value);
        this.setState({ products: [...this.state.products, value] });
        //TODO: Animate Card in
      });

      ref.on('child_changed', (x) => {
        const value: Product = x.val() as Product;
        Dashboard.log.debug('child_changed ', value);

        const i = this.state.products.findIndex((obj) => {
          return obj.id === value.id;
        });
        if (i === -1) {
          Dashboard.log.error('CRITICAL\nchild_changed does not exist or ID has changed.', value);
          return;
        }
        const items = [...this.state.products];
        items[i] = { ...value };
        this.setState({ products: items });
      });

      ref.on('child_removed', (x) => {
        const value: Product = x.val() as Product;
        Dashboard.log.debug('child_removed ', value);
        Dashboard.log.warn('TODO: Implement child_removed');
      });

      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount(): void {
    const ref = FirebaseService.fetchWholeReference();

    ref.off();
  }

  // TODO: Maybe to toggle?
  handleAddDialogClose(): void {
    Dashboard.log.debug('Closed AddProductDialog');
    this.setState({ dialogStates: { addDialog: { open: false } } });
  }

  handleAddDialogOpen(): void {
    Dashboard.log.debug('Opened AddProductDialog');
    this.setState({ dialogStates: { addDialog: { open: true } } });
  }

  // Pack checking logic into service
  async handleToggleReserve(product: Product): Promise<Product> {
    return FirebaseService.toggleReserve(product)
      .then((x) => {
        return Promise.resolve(x);
      })
      .catch((x) => {
        return Promise.reject(x);
      });
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <AddProductDialog
          isOpen={this.state.dialogStates.addDialog.open}
          handleClose={this.handleAddDialogClose}
        />
        <HeaderBar />
        <Container maxWidth="lg">
          <DashboardContent
            initialized={this.state.initialized}
            products={this.state.products}
            handler={this.handler}
          />
        </Container>
        <DashboardActions openAddHandler={this.handleAddDialogOpen} />
      </React.Fragment>
    );
  }
}
