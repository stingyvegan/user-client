import React, { Fragment, PropsWithChildren } from 'react';
import { Card, Image, Progress } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  progressFormatter,
  formatCurrency,
  formatIndividualUnit,
} from '../../helpers/formatters';
import styles from './product.module.css';
import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';

export type ProductCardProps = PropsWithChildren<{
  name: string;
  supplierName: string,
  totalCommitted: number,
  requiredUnits: number,
  isDiscrete: boolean,
  unitSize: number,
  unitName: string,
  totalCost: number,
  compact?: boolean,
}>;

function ProductCard(props: ProductCardProps) {
  const {
    name,
    supplierName,
    totalCommitted,
    requiredUnits,
    isDiscrete,
    unitSize,
    unitName,
    totalCost,
    compact = false,
    children,
  } = props;
  const percent = (totalCommitted / requiredUnits) * 100;
  let colour: SemanticCOLORS;
  if (percent < 66) {
    colour = 'grey';
  } else {
    colour = 'green';
  }
  return (
    <Fragment>
      <Card color={colour}>
        {!compact && <Image src="/assets/img-placeholder-256.png" />}
        <Card.Content>
          {compact && (
            <Image
              size="tiny"
              floated="right"
              src="/assets/img-placeholder-256.png"
            />
          )}
          <Card.Header>{name}</Card.Header>
          <Card.Content>
            {`${formatCurrency(totalCost / requiredUnits)}
              / ${formatIndividualUnit(isDiscrete, unitSize, unitName)}`}
          </Card.Content>
          <Card.Meta>{supplierName}</Card.Meta>
        </Card.Content>
        <Card.Content>
          <div className={styles['product-progress']}>
            <Progress percent={percent} color={colour}>
              {progressFormatter(
                totalCommitted,
                requiredUnits,
                isDiscrete,
                unitSize,
                unitName,
              )}
            </Progress>
          </div>
        </Card.Content>
        <Card.Content extra>{children}</Card.Content>
      </Card>
    </Fragment>
  );
}
export default ProductCard;

ProductCard.propTypes = {
  name: PropTypes.string,
  committed: PropTypes.number,
  required: PropTypes.number,
  children: PropTypes.node,
};
