import { Form, Button, Segment } from 'semantic-ui-react';
import { Formik, Field } from 'formik';

import PageHeading from '../components/PageHeading';

export type CompleteAccountProps = {
  loading: boolean;
  onCompleteAccount: (name: string, password: string) => void;
};

function CompleteAccount(props: CompleteAccountProps) {
  const { onCompleteAccount, loading } = props;
  return (
    <Segment loading={loading}>
      <PageHeading icon='user'>Complete Account</PageHeading>
      <Formik
        initialValues={{ password: '', name: '' }}
        onSubmit={(values) => {
          onCompleteAccount(values.name, values.password);
        }}
        render={(props) => (
          <Form onSubmit={props.handleSubmit}>
            <Form.Field>
              <label>Name</label>
              <Field type='text' name='name' />
            </Form.Field>
            <Form.Field>
              <label>New Password</label>
              <Field type='password' name='password' />
            </Form.Field>
            <Button type='submit'>Complete Account</Button>
          </Form>
        )}
      />
    </Segment>
  );
}
export default CompleteAccount;
