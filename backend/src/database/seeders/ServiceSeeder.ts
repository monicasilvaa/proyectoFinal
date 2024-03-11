import { Service } from "../../models/Service";
import { AppDataSource } from "../data-source";

export const serviceSeeder = async () => {
  try {
    // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();

    // Obtener el repositorio de servicios
    const serviceRepository = AppDataSource.getRepository(Service);

    const nutritionalCounselingService = new Service();
    nutritionalCounselingService.name = "Nutritional Counseling";

    const dietPlanService = new Service();
    dietPlanService.name = "Diet Plan";

    // Guardar los servicios en la base de datos
    await serviceRepository.save([nutritionalCounselingService, dietPlanService]);

    // Imprimir mensaje de éxito
    console.log("Seeding services successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};
