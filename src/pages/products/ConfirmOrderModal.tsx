import React from 'react';
import { Modal, Button, List, Message } from 'semantic-ui-react';

import { batchMessage } from './products.constants';

export type ConfirmOrderModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  orderAmount: string;
  orderCost: string;
  batchWarning: boolean;
};

export default function ConfirmOrderModal(props: ConfirmOrderModalProps) {
  const {
    open,
    onClose,
    onConfirm,
    productName,
    orderAmount,
    orderCost,
    batchWarning,
  } = props;
  return (
    <Modal size='tiny' open={open} onClose={onClose}>
      <Modal.Header>Confirm Order</Modal.Header>
      <Modal.Content>
        By continuing you are committing to purchase the following:
        <br />
        <br />
        <List horizontal relaxed>
          <List.Item>
            <List.Header>Product</List.Header>
            {productName}
          </List.Item>
          <List.Item>
            <List.Header>Amount</List.Header>
            {orderAmount}
          </List.Item>
          <List.Item>
            <List.Header>Cost</List.Header>
            {orderCost}
          </List.Item>
        </List>
        {batchWarning && (
          <Message size='tiny' warning>
            {batchMessage}
          </Message>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button basic negative onClick={onClose}>
          Cancel
        </Button>
        <Button positive onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
