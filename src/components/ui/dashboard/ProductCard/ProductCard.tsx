import React, { useState, useEffect } from 'react';
import jsLogger from 'js-logger';
import FirebaseService from 'services/firebase/FirebaseService';
import { Product } from 'types/data/productType';
import ProductCardContainer from './ProductCardContainer';
import ProductCardContent from './ProductCardContent';
interface ProductCardProps {
  productID: number;
}

export default function ProductCard(props: ProductCardProps): JSX.Element {
  const [isLoading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>({ id: 0, name: 'undef', isReserved: true });

  let initialized = false;
  let lastReservation = false;

  const log = jsLogger.get(`ProductCard #${props.productID}`);

  useEffect(() => {
    setLoading(true);

    // TODO: Initial Loading
    const ref = FirebaseService.fetchReference(props.productID);

    // onValueChange
    ref.on('value', (x) => {
      const data: Product = x.val();

      const changes = getChanges(data, product);

      // TODO: State Problem -> bleibt true bei Vergleich
      log.debug(`onValueChange: diff [${changes.toString()}]`);

      if (initialized && data.isReserved !== lastReservation) {
        // Data has changed
        //TODO: Check if reserved has been updated and play animation
        log.debug(`Product-Reservation has changed.`);
        lastReservation = data.isReserved;
      }

      setProduct(data);
      setLoading(false);
    });

    if (!initialized && product.name !== 'undef') {
      initialized = true;
      lastReservation = product.isReserved;
    }

    return () => {
      log.debug('Cleaning up...');
      ref.off();
      initialized = false;
    };
  }, [props.productID]);

  function getChanges(a: Product, b: Product) {
    const changes: string[] = [];

    a.description !== b.description && changes.push('description');
    a.id !== b.id && changes.push('id');
    a.name !== b.name && changes.push('name');
    a.imgUrl !== b.imgUrl && changes.push('imgUrl');
    a.isReserved !== b.isReserved && changes.push('isReserved');
    a.price !== b.price && changes.push('price');
    a.vendor !== b.vendor && changes.push('vendor');
    a.link !== b.link && changes.push('link');
    return changes;
  }

  return (
    <React.Fragment>
      <ProductCardContainer>
        <ProductCardContent isLoading={isLoading} product={product} />
      </ProductCardContainer>
    </React.Fragment>
  );
}
