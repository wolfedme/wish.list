import React, { Component } from 'react';
import jsLogger from 'js-logger';

import FirebaseService from 'services/firebase/FirebaseService';
import ProductCard from './ProductCard/ProductCard';
import { ListItem } from 'types/data/listItemType';

interface DashboardProps {}
interface DashboardState {
  products: ListItem[];
  isLoading: boolean;
  initialized: boolean;
}
export default class Dashboard extends Component<DashboardProps, DashboardState> {
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

    // TODO: Show "loading cards" during init
    FirebaseService.getProductsOnce()
      .then((arr) => {
        this.setState({ products: arr });
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
      <div>
        {this.state.products.map((x) => {
          return <ProductCard productID={x.id} key={x.id} />;
        })}
      </div>
    );
  }
}
