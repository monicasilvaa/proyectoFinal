import { meal } from "../../constants/Meal";
import { Meal } from "../../models/Meal";
import { AppDataSource } from "../data-source";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de meals y su almacenamiento en la base de datos.
 */
export const mealSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Obtener el repositorio de meals
      const mealRepository = AppDataSource.getRepository(Meal);
      const mealsArray = Object.values(meal);
      // Guardar los meals en la base de datos
      await mealRepository.save(mealsArray);

      // Imprimir mensaje de éxito
      console.log("Seeding meals successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   }
};