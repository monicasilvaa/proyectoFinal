import { AppDataSource } from "../data-source";
import { BusinessHour } from "../../models/BusinessHour";
import { BusinessHours } from "../../constants/BusinessHours";
import { Center } from "../../models/Center";

export const businessHourSeeder = async () => {
  try {
    await AppDataSource.initialize();

    const businessHourRepository = AppDataSource.getRepository(BusinessHour);
    const centerRepository = AppDataSource.getRepository(Center);

    // Obtener todos los centros
    const centers = await centerRepository.find();
    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    // Crear instancias de BusinessHour para cada día de la semana que está abierto el centro (lunes a sábado)
    const businessHoursArray: BusinessHour[] = [];

    for (const center of centers) {
      for (const dayOfWeek of daysOfWeek) {
        // Crea una nueva instancia de BusinessHour en cada iteración del bucle
        const businessHour = new BusinessHour();
        businessHour.center = center;
        businessHour.dayOfWeek = dayOfWeek;
        businessHour.openingTime = BusinessHours[dayOfWeek as keyof typeof BusinessHours].openingTime; 
        businessHour.closingTime = BusinessHours[dayOfWeek as keyof typeof BusinessHours].closingTime; 
        businessHoursArray.push(businessHour);
      }
    }

    // Guardar las instancias en la base de datos
    await businessHourRepository.save(businessHoursArray);

    // Imprimir mensaje de éxito
    console.log("Seeding business hours successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};