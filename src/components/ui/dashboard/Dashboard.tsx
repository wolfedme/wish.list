import React, { Component } from 'react';
import jsLogger from 'js-logger';

import FirebaseService from 'services/firebase/FirebaseService';

import DashboardContent from './DashboardContent';
import HeaderBar from './HeaderBar';
import { Container } from '@material-ui/core';
import { Product } from 'types/data/productType';

interface DashboardProps {}
interface DashboardState {
  products: Product[];
  isLoading: boolean;
  initialized: boolean;
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
    };
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

  render(): JSX.Element {
    return (
      <React.Fragment>
        <HeaderBar />
        <Container maxWidth="md">
          <DashboardContent
            initialized={this.state.initialized}
            productIDs={this.state.products.map((x) => {
              return x.id;
            })}
          />
        </Container>
      </React.Fragment>
    );
  }
}
