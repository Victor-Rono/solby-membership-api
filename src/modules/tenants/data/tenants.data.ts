/* eslint-disable prettier/prettier */
import { getEnumValues, uniqueArrayItems } from 'victor-dev-toolbox';
import { PermissionEnums } from 'src/shared/interfaces/permission.interface';
/* eslint-disable prettier/prettier */
const emailsToAdd: string[] =
    [
        'victorrono65@gmail.com',
    ]

export const emailsToRegisterToEveryOrganization: string[] = uniqueArrayItems(emailsToAdd);


export const ownerPermissions = getOwnerPermissions();

function getOwnerPermissions() {
    const permissionsToExclude: PermissionEnums[] = [PermissionEnums.ADMIN, PermissionEnums.ORGANIZATIONS];
    const permissions: PermissionEnums[] = getEnumValues(PermissionEnums);
    const permissionsToAdd = permissions.filter(p => !permissionsToExclude.includes(p));
    return permissionsToAdd;
}