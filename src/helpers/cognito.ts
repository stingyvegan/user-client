import { Role, RoleName } from '../types/role.types';

export const getRoles = (groupNames: RoleName[]) => {
  const groupsWithBasic: RoleName[] = ['basic', ...groupNames];
  return groupsWithBasic.map((r) => roleDetails(r));
};

export function roleDetails(groupName: RoleName): Role {
  let details = {
    key: groupName,
  };
  switch (groupName) {
    case 'admin':
      return {
        ...details,
        icon: 'cog',
        name: 'Administrator',
      };
    case 'basic':
      return {
        ...details,
        icon: 'user',
        name: 'Basic User',
      };
    default:
      return {
        ...details,
        icon: 'question',
        name: `Unknown (${groupName})`,
      };
  }
}
