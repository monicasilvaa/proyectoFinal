import { Food } from "../../models/Food";
import { FoodAttribute } from "../../models/FoodAttribute";
import { AppDataSource } from "../data-source";
import { FoodAttributeFactory } from "../factories/FoodAttributeFactory";

// -----------------------------------------------------------------------------

/**
 * Seeder para la generación de atributos de alimentos y su almacenamiento en la base de datos.
 */
export const foodAttributeSeeder = async () => {
   try {
      // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();

    // Obtener el repositorio de Food y FoodAttribute
    const foodRepository = AppDataSource.getRepository(Food);
    const foodAttributeRepository = AppDataSource.getRepository(FoodAttribute);

     // Crear una instancia de la factory para FoodAttribute
     const foodAttributeFactory = new FoodAttributeFactory(foodAttributeRepository);

    //Obtener todos los foods
    const foods = await foodRepository.find();

    //Crear un array de foodAttributes para almacenar los atributos a insertar en base de datos 
    let FoodAttributesArray: FoodAttribute[] = [];

    //Crear una cantidad de atributos por alimento
    for (const food of foods){
        const foodAttributes = foodAttributeFactory.createMany(5).map((foodAttribute, index) => {
          foodAttribute.food = food;
            return foodAttribute;
        });

        FoodAttributesArray = FoodAttributesArray.concat(foodAttributes);
    }

    // Guardar instancias de foodAttribute en la base de datos
    await foodAttributeRepository.save(FoodAttributesArray);

    // Imprimir mensaje de éxito
    console.log("Seeding foodAttributes successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};

