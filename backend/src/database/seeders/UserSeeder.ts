import { UserRoles } from "../../constants/UserRoles";
import { Role } from "../../models/Role";
import { User } from "../../models/User";
import { AppDataSource } from "../data-source";
import { UserFactory } from "../factories/UserFactory";

export const userSeeder = async () => {
  try {
    await AppDataSource.initialize();
    const count = 3;

 // / Llamar a la función para sembrar usuarios con roles de superadmin
    await seedUsersWithRole({
        role: UserRoles.SUPERADMIN,
        count: count,
    });

    console.log("Seeding users successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};

export const seedUsersWithRole = async ({
    role,
    count,
 }: {
    role: Role;
    count: number;
 }) => {
    // Obtener repositorios y fábricas necesarios
    const userRepository = AppDataSource.getRepository(User);
    const userFactory = new UserFactory(userRepository);
 
    // Generar usuarios
    const users = userFactory.createMany(count);
 
    // Asignar roles a cada usuario
    users.forEach((user) => {
       user.role = role;
    });
 
    // Guardar usuarios en la base de datos
    await userRepository.save(users);
 
    return users;
 };
