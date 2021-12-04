import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Button, Icon } from 'semantic-ui-react';
import { formatUnit } from '../helpers/formatters';
import { isNumber } from '../helpers/number';
import { Product } from '../services/product.types';

export type AmountSelectorProps = {
  product: Product;
  committedUnits: number;
  onAmountChanged: (newAmount: number) => void;
  className?: string;
};

export default styled(function AmountSelector({
  product,
  committedUnits,
  onAmountChanged,
  className,
}: AmountSelectorProps) {
  const { isDiscrete, unitName, unitSize } = product;

  const [proposedChange, setProposedChange] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className={className}>
      <Button
        icon
        onClick={() => {
          if (committedUnits > 0) onAmountChanged(committedUnits - 1);
        }}
      >
        <Icon name='minus' />
      </Button>
      <div className='input-container'>
        <Input
          label={{
            basic: true,
            content: formatUnit(isDiscrete, unitName),
          }}
          labelPosition='right'
          placeholder='Amount...'
          value={
            proposedChange === ''
              ? ''
              : proposedChange || committedUnits * unitSize
          }
          onChange={(e) => setProposedChange(e.target.value)}
          onBlur={(e: any) => {
            setProposedChange(undefined);
            if (isNumber(e.target.value)) {
              const units = Math.round(e.target.value / unitSize);
              onAmountChanged(Math.max(units, 1));
            }
          }}
        />
      </div>
      <Button icon onClick={() => onAmountChanged(committedUnits + 1)}>
        <Icon name='plus' />
      </Button>
    </div>
  );
})`
  display: flex;
  width: 100%;

  & .input-container {
    padding-left: 1rem;
    padding-right: 1rem;
    flex-grow: 1;

    div.input {
      width: 100%;
    }
  }
`;
