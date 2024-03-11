import { Food } from "../../models/Food";
import { AppDataSource } from "../data-source";
import { FoodFactory } from "../factories/FoodFactory";

export const foodSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Obtener el repositorio de Food
      const foodRepository = AppDataSource.getRepository(Food);

      // Crear una instancia de la factory para Food
      const foodFactory = new FoodFactory(foodRepository);
      const foods = foodFactory.createMany(10);

      // Guardar instancias de food en la base de datos
      await foodRepository.save(foods);

      // Imprimir mensaje de éxito
      console.log("Seeding food successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   } 
};
