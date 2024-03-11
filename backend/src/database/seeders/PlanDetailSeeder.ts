import { meal } from "../../constants/Meal";
import { DietPlan } from "../../models/DietPlan";
import { Food } from "../../models/Food";
import { Meal } from "../../models/Meal";
import { PlanDetail } from "../../models/PlanDetail";
import { AppDataSource } from "../data-source";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de atributos de alimentos y su almacenamiento en la base de datos.
 */
export const planDetailSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();

    // Obtener el repositorio de DietPlan, Meal, Food y PlanDetail
    const dietPlanRepository = AppDataSource.getRepository(DietPlan)
    const foodRepository = AppDataSource.getRepository(Food);
    const mealRepository = AppDataSource.getRepository(Meal);
    const planDetailRepository = AppDataSource.getRepository(PlanDetail)

    //Obtener todos los dietPlan
    const dietPlans = await dietPlanRepository.find();

    //Crear un array de planDetail para almacenar los atributos a insertar en base de datos 
    let planDetailArray: PlanDetail[] = [];

    //Se recorren todos los DietPlan obtenidos
    for (const dietPlan of dietPlans) {
      //Se recorren todos los Meal establecidos en la constante meal
        for (const [key, value] of Object.entries(meal)) {
            const food = await foodRepository.createQueryBuilder('food').select().orderBy('RAND()').getOne();
            
            if(!food) {
                console.error("Food not found!");
                return false;
            }

            const planDetail = new PlanDetail();
            
            planDetail.dietPlan = dietPlan;
            planDetail.food = food;
            planDetail.meal = value;
      
            planDetailArray = planDetailArray.concat(planDetail);
        };
     }

    // Guardar instancias de planDetail en la base de datos
    await planDetailRepository.save(planDetailArray);

    // Imprimir mensaje de éxito
    console.log("Seeding planDetail successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};

