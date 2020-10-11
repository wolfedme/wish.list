/* eslint-disable react/jsx-props-no-spreading */

import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@material-ui/core';
import ContentContainer from '../../layout/ContentContainer';
import LoadingSpinner from '../../general/LoadingSpinner';

import HeaderBar from '../../layout/HeaderBar';

import DebugPanel from '../../debug/DebugPanel';
import { FirebaseContext } from '../../../globals/firebase';
import { LoggerContext } from '../../../globals/logger';
import ProductGrid from '../../Dashboard/ProductGrid';

const Dashboard = () => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const log = useContext(LoggerContext);

  const [productList, setProductList] = useState({});
  const [isLoading, setLoading] = useState(false);

  const refreshList = 0; // TODO: Create dependency to refresh product list

  // TODO: Fetch newest Amazon Price?

  const fetchItems = async () => {
    log.debug('DEBUG Starting to fetch products');
    const productRef = firebase.db.ref('/products');
    await productRef
      .once('value')
      .then((snapshot) => {
        log.debug(`DEBUG Fetched ${snapshot.val().length} entries from '/products'`);
        setProductList(snapshot.val());
      })
      .catch((err) => {
        log.error(`ERROR Failed fetching /products: ${err.message}`);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchItems().then(() => {
      setLoading(false);
    });
  }, [refreshList]);

  return (
    <>
      <HeaderBar title={t('appTitle')} />
      <ContentContainer maxWidth="xl">
        <Grid container spacing={5} justify="center">
          {isLoading ? (
            <>
              <LoadingSpinner />
              <Typography>Fetching products from database</Typography>
            </>
          ) : (
            <ProductGrid products={productList} />
          )}
        </Grid>
        <DebugPanel />
      </ContentContainer>
    </>
  );
};

export default Dashboard;
