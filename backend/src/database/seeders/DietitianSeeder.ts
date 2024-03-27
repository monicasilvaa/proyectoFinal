import { UserRoles } from "../../constants/UserRoles";
import { Dietitian } from "../../models/Dietitian";
import { AppDataSource } from "../data-source";
import { DietitianFactory } from "../factories/DietitianFactory";
import { seedUsersWithRole } from "./UserSeeder";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de dietistas y su almacenamiento en la base de datos.
 */
export const dietitianSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Definir la cantidad de dietistas a crear
      const count = 3;

      // Llamar a la función para crear profesores con usuarios asociados
      await seedDietitiansWithUser(count);

      // Imprimir mensaje de éxito
      console.log("Seeding dietitians successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   }
};

export const seedDietitiansWithUser = async (count: number) => {
   // Obtener repositorios y fábricas necesarios
   const dietitianRepository = AppDataSource.getRepository(Dietitian);
   const dietitianFactory = new DietitianFactory(dietitianRepository);

   // Generar usuarios con roles de profesor
   const users = await seedUsersWithRole({
      role: UserRoles.DIETITIAN,
      count,
   });

   // Generar profesores
   const dietitians = dietitianFactory.createMany(count);

   // Asignar usuario a cada dietista
   dietitians.forEach((dietitian, index) => {
      dietitian.user = users[index];
   });

   // Guardar profesores en la base de datos
   await dietitianRepository.save(dietitians);

   return dietitians;
};