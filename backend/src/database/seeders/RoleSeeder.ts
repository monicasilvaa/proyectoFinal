import { Role } from "../../models/Role";
import { AppDataSource } from "../data-source";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de roles y su almacenamiento en la base de datos.
 */
export const roleSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Obtener el repositorio de roles
      const roleRepository = AppDataSource.getRepository(Role);

      const superadminRole = new Role();
      superadminRole.name = "superadmin";

      const clientRole = new Role();
      clientRole.name = "client";

      const dietitianRole = new Role();
      dietitianRole.name = "dietitian";

      // Guardar los roles en la base de datos
      await roleRepository.save([superadminRole, clientRole, dietitianRole]);

      // Imprimir mensaje de éxito
      console.log("Seeding roles successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   }
};