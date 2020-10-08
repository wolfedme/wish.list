/* eslint-disable react/jsx-props-no-spreading */

import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@material-ui/core';
import ContentContainer from '../../layout/ContentContainer';
import LoadingSpinner from '../../general/LoadingSpinner';

import HeaderBar from '../../layout/HeaderBar';

import DebugPanel from '../../debug/DebugPanel';
import { FirebaseContext } from '../../../globals/firebase';
import ProductGrid from '../../Dashboard/ProductGrid';

const Dashboard = () => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);

  const [productList, setProductList] = useState({});
  const [isLoading, setLoading] = useState(false);

  // TODO: Fetch newest Amazon Price?
  // TODO: Unique ID

  // TODO: Maybe migrate back to jsx

  const fetchItems = async () => {
    console.log('DEBUG Starting to fetch products');
    const productRef = firebase.db.ref('/products');
    await productRef.once('value').then((snapshot) => {
      console.log(`DEBUG Fetched ${snapshot.val().length} entries`);
      setProductList(snapshot.val());
      return 1;
    });
  };

  useEffect(() => {
    setLoading(true);
    console.log(fetchItems());
    fetchItems().then((data) => {
      console.log('DEBUG Set data. Productlist is size ' + productList.length);
      setLoading(false);
    });
  }, []);

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
