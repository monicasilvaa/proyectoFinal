import { UserRoles } from "../../constants/UserRoles";
import { Client } from "../../models/Client";
import { AppDataSource } from "../data-source";
import { ClientFactory } from "../factories/ClientFactory";
import { seedUsersWithRole } from "./UserSeeder";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de dietistas y su almacenamiento en la base de datos.
 */
export const clientSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Definir la cantidad de dietistas a crear
      const count = 3;

      // Llamar a la función para crear profesores con usuarios asociados
      await seedClientsWithUser(count);

      // Imprimir mensaje de éxito
      console.log("Seeding clients successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   }
};

export const seedClientsWithUser = async (count: number) => {
   // Obtener repositorios y fábricas necesarios
   const clientRepository = AppDataSource.getRepository(Client);
   const clientFactory = new ClientFactory(clientRepository);

   // Generar usuarios con roles de profesor
   const users = await seedUsersWithRole({
      role: UserRoles.DIETITIAN,
      count,
   });

   // Generar profesores
   const clients = clientFactory.createMany(count);

   // Asignar usuario a cada profesor
   clients.forEach((client, index) => {
      client.user = users[index];
   });

   // Guardar profesores en la base de datos
   await clientRepository.save(clients);

   return clients;
};