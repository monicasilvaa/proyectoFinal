import { Role } from "../models/Role";

export const UserRoles = {
   SUPERADMIN: { id: 1, name: "superadmin" } as Role,
   CLIENT: { id: 2, name: "client" } as Role,
   DIETITIAN: { id: 3, name: "dietitian" } as Role,
};