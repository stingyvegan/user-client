import { RoleName } from './types/role.types';

const accessMatrix = {
  order: ['basic', 'admin'],
  product: ['basic', 'admin'],
  admin: ['admin'],
};

export type ResourceName = 'order' | 'product' | 'admin';

export function canAccess(roles: RoleName[], resource: ResourceName) {
  const allowedRoles = accessMatrix[resource];
  return allowedRoles.find((allowedRole) =>
    roles.find((role) => role === allowedRole),
  );
}
