import { Center } from "../../models/Center";
import { Dietitian } from "../../models/Dietitian";
import { AppDataSource } from "../data-source";

export const dietitianCenterSeeder = async () => {
  try {
    await AppDataSource.initialize();

    const dietitianRepository = AppDataSource.getRepository(Dietitian);
    const centerRepository = AppDataSource.getRepository(Center);

    // Obtener dietistas y centros
    const dietitians = await dietitianRepository.find();

    const centers = await centerRepository.find();

    // Verificar que todas las instancias sean válidas
    if (!dietitians || !centers) {
      console.error("Error obtaining instances");
      return;
    }

    // Asignar dietistas a centros de forma aleatoria
    const values = dietitians.map((dietitian) => {
        const randomCenter = centers[Math.floor(Math.random() * centers.length)];
        return `(${dietitian.id}, ${randomCenter.id})`;
      }).join(',');
  
      // Ejecutar la consulta SQL directamente
      const query = `INSERT INTO dietitianCenters (dietitian_id, center_id) VALUES ${values};`;
      await AppDataSource.query(query);

    // Imprimir mensaje de éxito
    console.log("Seeding dietitianCenters successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};
