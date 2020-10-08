import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { TProduct } from '../../../common/types/TProduct';
import ItemCard from '../../ItemCard/ItemCard';
import ContentContainer from '../../layout/ContentContainer';

import { Grid } from '@material-ui/core';

import { FirebaseContext } from '../../../globals/firebase';

import HeaderBar from '../../layout/HeaderBar';

import DebugPanel from '../../debug/DebugPanel';

const Dashboard = ({ products }) => {
  const { t } = useTranslation();
  <FirebaseContext.Consumer>
    {(firebase) => {
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
            <DebugPanel />
          </ContentContainer>
        </>
      );
    }}
  </FirebaseContext.Consumer>;
};

export default Dashboard;
