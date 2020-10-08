/* eslint-disable react/jsx-props-no-spreading */

import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@material-ui/core';
import ItemCard from '../../Dashboard/ItemCard';
import ContentContainer from '../../layout/ContentContainer';
import LoadingSpinner from '../../general/LoadingSpinner';

import HeaderBar from '../../layout/HeaderBar';

import DebugPanel from '../../debug/DebugPanel';
import { FirebaseContext } from '../../../globals/firebase';

const Dashboard = () => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);

  const [productList, setProductList] = useState([]); // TODO!
  const [isLoading, setLoading] = useState(false);

  // TODO: Fetch newest Amazon Price?
  // TODO: Unique ID

  // TODO: Maybe migrate back to jsx

  const fetchItems = () => {
    console.log(firebase);
    const productRef = firebase.db.ref('/products');
    try {
      productRef.once('value').then((snapshot) => {
        console.log('snapshot' + snapshot);
        return snapshot;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const renderList = () => {
    console.log('rendering!');
    return productList.map((x) => (
      <Grid item>
        <ItemCard {...x} imgHeight={150} />
      </Grid>

      // TODO: Own component for productlist
    ));
  };

  const emptyList = <Typography>No items found!</Typography>;

  return (
    <>
      <HeaderBar title={t('appTitle')} />
      <ContentContainer maxWidth="xl">
        <Grid container spacing={5} justify="center">
          {isLoading ? <LoadingSpinner /> : productList.length <= 0 ? emptyList : renderList}
        </Grid>
        <DebugPanel />
      </ContentContainer>
    </>
  );
};

export default Dashboard;
