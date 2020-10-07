import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { TProduct } from '../../../common/TProduct';
import ItemCard from '../../ItemCard/ItemCard';
import ContentContainer from '../general/ContentContainer';

import { Grid } from '@material-ui/core';

import HeaderBar from '../general/HeaderBar';

const Dashboard = ({ products }) => {
  const { t } = useTranslation();
  return (
    <>
      <HeaderBar title={t('appTitle')} />
      <ContentContainer maxWidth="xl">
        <Grid container spacing={5} justify="center">
          {products.map((x: TProduct) => (
            <Grid item>
              <ItemCard {...x} imgHeight={150} />
            </Grid>
          ))}
        </Grid>
        {/* TODO: Card Layout Holder for List/Grid! */}
      </ContentContainer>
    </>
  );
};

export default Dashboard;
