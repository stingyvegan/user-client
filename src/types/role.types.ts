import { SemanticICONS } from 'semantic-ui-react';

export type RoleName = 'basic' | 'admin';

export type Role = {
  key: string;
  icon: SemanticICONS;
  name: string;
};
