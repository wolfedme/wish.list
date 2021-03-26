import React, { Component } from 'react';
import jsLogger from 'js-logger';

import FirebaseService from 'services/firebase/FirebaseService';

import DashboardContent from './DashboardContent';
import HeaderBar from './HeaderBar';
import AddProductDialog from 'components/ui/dialogs/AddProductForm/AddProductDialog';
import DashboardActions from './DashboardActions';

import LoginDialog from 'components/ui/dialogs/LoginDialog';

import { Container } from '@material-ui/core';
import { Product } from 'types/data/productType';

interface DashboardProps {}
interface DashboardState {
  products: Product[];
  isLoading: boolean;
  initialized: boolean;
  addDialog: {
    open: boolean;
  };
  loginDialog: {
    open: boolean;
  };
}
export default class Dashboard extends Component<DashboardProps, DashboardState> {
  // TODO: Add empty "nothin is here" component if no products are present

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
      addDialog: {
        open: false,
      },
      loginDialog: {
        open: false,
      },
    };

    this.handleAddDialogClose = this.handleAddDialogClose.bind(this);
    this.handleAddDialogOpen = this.handleAddDialogOpen.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleLoginDialog = this.toggleLoginDialog.bind(this);
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

  async handleLogin(user: string, pass: string): Promise<void> {
    FirebaseService.signInUser(user, pass)
      .then(() => {
        return Promise.resolve();
      })
      .catch((x) => {
        Dashboard.log.error('Error while signing in: ', x);
        return Promise.reject(x);
      });
  }

  async handleLogout(): Promise<void> {
    FirebaseService.signOut()
      .then(() => {
        return Promise.resolve();
      })
      .catch((x) => {
        Dashboard.log.error('Error while signing in: ', x);
        return Promise.reject(x);
      });
  }

  // TODO: Maybe to toggle?
  handleAddDialogClose(): void {
    Dashboard.log.debug('Closed AddProductDialog');
    this.setState({ addDialog: { open: false } });
  }

  handleAddDialogOpen(): void {
    Dashboard.log.debug('Opened AddProductDialog');
    this.setState({ addDialog: { open: true } });
  }

  toggleLoginDialog(): void {
    Dashboard.log.debug('Toggled LoginDialog');
    this.setState({ loginDialog: { open: !this.state.loginDialog.open } });
  }

  // Pack checking logic into service
  async handleToggleReserve(product: Product): Promise<Product> {
    return FirebaseService.toggleReserve({ ...product })
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
          isOpen={this.state.addDialog.open}
          handleClose={this.handleAddDialogClose}
        />
        <LoginDialog
          isOpen={this.state.loginDialog.open}
          closeHandler={this.toggleLoginDialog}
          handleLogin={this.handleLogin}
        />
        <HeaderBar
          handler={{ toggleLoginHandler: this.toggleLoginDialog, logoutHandler: this.handleLogout }}
          isLoggedIn={!FirebaseService.getIsAnon() && FirebaseService.getUserID !== undefined}
        />
        <Container maxWidth="lg">
          <DashboardContent
            initialized={this.state.initialized}
            products={this.state.products}
            handler={this.handler}
          />
        </Container>
        <DashboardActions
          isSignedIn={!FirebaseService.getIsAnon()}
          openAddHandler={this.handleAddDialogOpen}
          disableButtons={!this.state.initialized}
        />
      </React.Fragment>
    );
  }
}
