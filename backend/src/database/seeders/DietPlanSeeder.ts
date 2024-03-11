import { Client } from "../../models/Client";
import { DietPlan } from "../../models/DietPlan";
import { Dietitian } from "../../models/Dietitian";
import { AppDataSource } from "../data-source";
import { DietPlanFactory } from "../factories/DietPlanFactory";

export const dietPlanSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
      await AppDataSource.initialize();

      // Obtener el repositorio de Food
      const dietPlanRepository = AppDataSource.getRepository(DietPlan);
      const dietitianRepository = AppDataSource.getRepository(Dietitian);
      const clientRepository = AppDataSource.getRepository(Client);
      
      // Crear una instancia de la factory para Food
      const dietPlanFactory = new DietPlanFactory(dietPlanRepository);
      const dietPlans = await Promise.all(dietPlanFactory.createMany(10).map(async (dietPlan, index) => {
            const clientUser = await clientRepository.createQueryBuilder('client').select().orderBy('RAND()').getOne();
            const dietitianUser = await dietitianRepository.createQueryBuilder('dietitian').select().orderBy('RAND()').getOne();

            // Verificar que todas las instancias sean válidas
            if (!clientUser || !dietitianUser) {
               console.error("Error obtaining instances");
               return null;
            }

            dietPlan.client = clientUser;
            dietPlan.dietitian = dietitianUser;

            return dietPlan;

         })
      );

   // Limpiamos los posibles nulos obtenidos en el .map anterior
   const results = dietPlans.filter((dietPlan) => dietPlan !== null) as DietPlan[];

   await dietPlanRepository.save(results);


      
      // Imprimir mensaje de éxito
      console.log("Seeding diet plan successfully completed");
   } catch (error) {
      console.error("Error seeding the database:", error);
   } finally {
      // Cerrar la conexión con la base de datos, independientemente del resultado
      await AppDataSource.destroy();
   } 
};
