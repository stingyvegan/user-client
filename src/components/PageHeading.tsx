import React, { PropsWithChildren } from 'react';
import { Header, Icon, SemanticICONS } from 'semantic-ui-react';

export type PageHeadingProps = PropsWithChildren<{
  icon: SemanticICONS;
}>;

function PageHeading({ icon, children }: PageHeadingProps) {
  return (
    <Header as='h2' textAlign='center'>
      {icon && <Icon name={icon} circular />}
      {children}
    </Header>
  );
}
export default PageHeading;
