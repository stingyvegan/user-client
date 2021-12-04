import { Form, Button, Segment } from 'semantic-ui-react';
import { Formik, Field } from 'formik';

import PageHeading from '../components/PageHeading';

export type LoginProps = {
  loading: boolean;
  onSignIn: (email: string, password: string) => void;
}

export default function Login({ onSignIn, loading }: LoginProps) {
  return (
    <Segment loading={loading}>
      <PageHeading icon="user">Login</PageHeading>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values, actions) => {
          onSignIn(values.email, values.password);
        }}
        render={props => (
          <Form onSubmit={props.handleSubmit}>
            <Form.Field>
              <label>Email</label>
              <Field type="email" name="email" placeholder="Email" />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <Field type="password" name="password" />
            </Form.Field>
            <Button type="submit">Log In</Button>
          </Form>
        )}
      />
    </Segment>
  );
}
