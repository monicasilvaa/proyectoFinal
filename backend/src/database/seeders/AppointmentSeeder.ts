import { Services } from "../../constants/Services";
import { Appointment } from "../../models/Appointment";
import { Center } from "../../models/Center";
import { Client } from "../../models/Client";
import { AppDataSource } from "../data-source";
import { AppointmentFactory } from "../factories/AppointmentFactory";
import { Dietitian } from './../../models/Dietitian';

export const appointmentSeeder = async () => {
  try {
    await AppDataSource.initialize();

    const appointmentRepository = AppDataSource.getRepository(Appointment);
    const dietitianRepository = AppDataSource.getRepository(Dietitian);
    const clientRepository = AppDataSource.getRepository(Client);
    const centerRepository = AppDataSource.getRepository(Center);

    // Obtener instancias de Client, Dietitian, Center y Service
    //Se obtiene un cliente aleatorio
    const clientUser = await clientRepository.createQueryBuilder('client').leftJoinAndSelect("client.user", "user").orderBy('RAND()').getOne();
    //Se obtiene un dietista aleatorio
    const dietitianUser = await dietitianRepository.createQueryBuilder('dietitian').leftJoinAndSelect("dietitian.user", "user").orderBy('RAND()').getOne();

    const centers = await centerRepository.find();
    const nutritionalCounselingService = Services.NUTRITIONAL_COUNSELING;
    const dietPlanService = Services.DIET_PLAN;

    // Verificar que todas las instancias sean válidas
    if (!clientUser || !dietitianUser || !centers || !nutritionalCounselingService || !dietPlanService) {
      console.error("Error obtaining instances");
      return;
    }

    // Crear instancias de Appointment
    const appointmentFactory = new AppointmentFactory(appointmentRepository);

    const appointments = appointmentFactory.createMany(10).map((appointment, index) => {
      appointment.client = clientUser;
      appointment.dietitian = dietitianUser;
      // Asignar valores a modified_by basados en el username de User
      appointment.modified_by = index % 2 === 0 ? clientUser.user.username : dietitianUser.user.username;

      // Seleccionar un centro aleatorio
      appointment.center = centers[Math.floor(Math.random() * centers.length)];

      // Alternar entre los servicios de asesoramiento nutricional y plan dietetico
      appointment.service = index % 2 === 0 ? nutritionalCounselingService : dietPlanService;

      return appointment;
    });

    // Guardar las instancias en la base de datos
    await appointmentRepository.save(appointments);

    // Imprimir mensaje de éxito
    console.log("Seeding appointments successfully completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    // Cerrar la conexión con la base de datos, independientemente del resultado
    await AppDataSource.destroy();
  }
};
