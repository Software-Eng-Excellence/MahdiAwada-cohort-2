

export enum Role {
    admin = 'admin',
    user = 'user',
    guest = 'guest',
    manager = 'manager'
}

export enum Permission {
    READ_ORDER = "read:order",
    WRITE_ORDER = "write:order",
    UPDATE_ORDER = "update:order",
    DELETE_ORDER = "delete:order",
    READ_USER = "read:user",
    WRITE_USER = "write:user",
    UPDATE_USER = "update:user",
    DELETE_USER = "delete:user",
    AUTH_LOGIN = "auth:login",
    AUTH_LOGOUT = "auth:logout",
}

type RolePermissions = {
    [key in Role] : Permission[]
}

export const rolePermissions: RolePermissions = {
    [Role.admin]: [
        ...Object.values(Permission)
    ],
    [Role.user]: [
        Permission.READ_ORDER,
        Permission.WRITE_ORDER,
        Permission.UPDATE_ORDER,
        Permission.DELETE_ORDER,
        Permission.READ_USER,
        Permission.WRITE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER
    ],
    [Role.guest]: [
        Permission.WRITE_USER,
        Permission.READ_ORDER, 
        Permission.AUTH_LOGIN
    ],
    [Role.manager]: [
        Permission.READ_ORDER,   // Managers can view orders
        Permission.WRITE_ORDER,  // Managers can create orders
        Permission.UPDATE_ORDER, // Managers can update orders
        Permission.DELETE_ORDER, // Managers can delete orders
        Permission.READ_USER,    // Managers can view user info
    ]
}

export const toRole = (role: string): Role => {
    switch (role) {
        case Role.admin: 
            return Role.admin;
        case Role.user:
            return Role.user;
        case Role.guest:
            return Role.guest;
        case Role.manager:
            Role.manager;
        default:
            throw new Error(`Invalid role: ${role}`)
    }
}