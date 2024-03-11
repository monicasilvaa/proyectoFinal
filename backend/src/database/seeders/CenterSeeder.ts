import { AppDataSource } from "../data-source";
import { Center } from "../../models/Center";
import { CenterFactory } from "../factories/CenterFactory";

export const centerSeeder = async () => {
  try {
    // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();

    // Obtener el repositorio de centros
    const centerRepository = AppDataSource.getRepository(Center);

    // Crear una instancia de la factory para Centros
    const centerFactory = new CenterFactory(centerRepository);

    // Número de centros a sembrar
    const numberOfCenters = 5; 

    // Crear e insertar instancias de centros en la base de datos
    const centers = centerFactory.createMany(numberOfCenters);
    await centerRepository.save(centers);

    // Imprimir mensaje de éxito
    console.log("Seeding centers successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};

