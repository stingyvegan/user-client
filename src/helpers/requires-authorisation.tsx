import { CurrentAuthenticatedUser } from '../auth/auth.service';
import Unauthorised from '../components/Unauthorised';
import { canAccess, ResourceName } from '../rbac';

const requiresAuthorisation = (
  inputComponent: JSX.Element,
  user: CurrentAuthenticatedUser | undefined,
  resourceName: ResourceName,
  initialLoad: boolean,
): JSX.Element => {
  const roles = user?.groups || [];
  if (canAccess(roles, resourceName)) {
    return inputComponent;
  } else if (!initialLoad) {
    return <Unauthorised />;
  }
  return <span />;
};

export default requiresAuthorisation;
