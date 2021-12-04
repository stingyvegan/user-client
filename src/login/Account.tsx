import { Segment, Label, Icon } from 'semantic-ui-react';

import PageHeading from '../components/PageHeading';
import { Role } from '../types/role.types';

export type LoginProps = {
  name: string;
  loading: boolean;
  roles: Role[];
};

function Account({ name, loading, roles }: LoginProps) {
  return (
    <Segment loading={loading}>
      <PageHeading icon='user'>{name}</PageHeading>
      <p>Welcome, {name}</p>
      {roles.length > 0 && (
        <div>
          {roles.map((role) => (
            <Label key={role.key}>
              <Icon name={role.icon} />
              {role.name}
            </Label>
          ))}
        </div>
      )}
    </Segment>
  );
}
export default Account;
