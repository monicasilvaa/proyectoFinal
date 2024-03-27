import { Request, Response } from "express";
import { LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";
import { DaysOfWeek } from "../constants/BusinessHours";
import { AppDataSource } from "../database/data-source";
import { Appointment } from "../models/Appointment";
import { BusinessHour } from "../models/BusinessHour";
import { Center } from "../models/Center";
import { Client } from "../models/Client";
import { Dietitian } from "../models/Dietitian";
import { Controller } from "./Controller";

// -----------------------------------------------------------------------------

export class AppointmentController implements Controller {
   async getAll(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const appointmentRepository = AppDataSource.getRepository(Appointment);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 20;

         const [allAppointments, count] = await appointmentRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            relations: ['client','client.user','dietitian','dietitian.user', 'service', 'center'],
            select: {
               id: true,
               appointment_date: true
            },
         });

         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allAppointments,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting appointments",
         });
      }
   }

   async getById(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const appointmentRepository = AppDataSource.getRepository(Appointment);
         
         const appointment = await appointmentRepository.findOne({
            where: {
               id: id
            },
            relations: ['dietitian','dietitian.user', 'client','client.user', 'center', 'service']
         });

         if (!appointment) {
            return res.status(404).json({
               message: "Appointment not found",
            });
         }

         res.status(200).json(appointment);
      } catch (error) {
         res.status(500).json({
            message: "Error while getting appointment",
         });
      }
   }

   async create(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const data = req.body;

         const appointmentRepository = AppDataSource.getRepository(Appointment);
         const centerRepository = AppDataSource.getRepository(Center);
         const clientRepository = AppDataSource.getRepository(Client);
         const dietitianRepository = AppDataSource.getRepository(Dietitian);
         const businessHourRepository = AppDataSource.getRepository(BusinessHour);

         data.appointment_date = new Date(data.appointment_date);

         //Se obtiene el Center usando el data.center (id de centro) recibido en la petición
         data.center = await centerRepository.findOneBy({
            id: data.center.id || data.center
         }) as Center;

         const appointmentTime = data.appointment_date.getHours() + ":" + data.appointment_date.getMinutes() + ":00";

         const businessHours = await businessHourRepository.find({
            relations: {
               center: true
            },
            where: {
               center: data.center,
               openingTime: LessThanOrEqual(appointmentTime),
               closingTime: MoreThanOrEqual(appointmentTime),
               dayOfWeek: DaysOfWeek[data.appointment_date.getDay()]
            }
         }) as BusinessHour[];

         if (businessHours.length <= 0) {
            return res.status(400).json({
               message: "Appointment time not available",
            });
         }

         data.clientUser = await clientRepository.findOne({
            where: {id: data.client},
            relations: ['user']
         }) as Client;

         data.client = data.clientUser

         data.dietitian = await dietitianRepository.findOneBy({
            id: data.dietitian.id || data.dietitian
         }) as Dietitian;

         //Se verifica si el dietitian recibido tiene alguna cita para la fecha recibida
         const dietitianAvailable = await appointmentRepository.find({
            relations: {
               dietitian: true
            },
            where: {
               dietitian: data.dietitian,
               appointment_date: data.appointment_date
            }
         }) as Appointment[];

         //En caso de existir una cita devolvemos error
         if (dietitianAvailable.length > 0) {
            return res.status(400).json({
               message: "Dietitian not available to selected date",
            });
         }

         await appointmentRepository.save(data);
            res.status(201).json({
               message: "Appointment created successfully",
            });      
         } catch (error) {
            res.status(500).json({
               message: "Error while creating appointment" + error,
            });
         }
   }

   async update(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;
         const data = req.body;

         const appointmentRepository = AppDataSource.getRepository(Appointment);
         const businessHourRepository = AppDataSource.getRepository(BusinessHour);
         const dietitianRepository = AppDataSource.getRepository(Dietitian);
         const centerRepository = AppDataSource.getRepository(Center);

         const appointment = await appointmentRepository.findOneBy({
            id: id,
         });

         if (!appointment) {
            return res.status(404).json({
               message: "Appointment not found" + id,
            });
         }


         //Se obtiene el Center usando el data.center (id de centro) recibido en la petición
         data.center = await centerRepository.findOneBy({
            id: data.center.id || data.center
         }) as Center;

         if (data.appointment_date) {
            data.appointment_date = new Date(data.appointment_date);
          }

          const appointmentTime = data.appointment_date.getHours() + ":" + data.appointment_date.getMinutes() + ":00";

          const businessHours = await businessHourRepository.find({
             relations: {
                center: true
             },
             where: {
                center: data.center,
                openingTime: LessThanOrEqual(appointmentTime),
                closingTime: MoreThanOrEqual(appointmentTime),
                dayOfWeek: DaysOfWeek[data.appointment_date.getDay()]
             }
          }) as BusinessHour[];

         if (businessHours.length <= 0) {
            return res.status(400).json({
               message: "Appointment time not available",
            });
         }
         
         data.dietitian = await dietitianRepository.findOneBy({
            id: data.dietitian.id || data.dietitian
         }) as Dietitian;

         //Se verifica si el dietitian recibido tiene alguna cita para la fecha recibida
         const dietitianAvailable = await appointmentRepository.find({
            relations: {
               dietitian: true
            },
            where: {
               dietitian: data.dietitian,
               appointment_date: data.appointment_date,
               id: Not(id)
            }
         }) as Appointment[];

         //En caso de existir una cita devolvemos error
         if (dietitianAvailable.length > 0) {
            return res.status(400).json({
               message: "Dietitian not available to selected date",
            });
         }

         await appointmentRepository.update({ id: id }, data);

         res.status(202).json({
            message: "Appointment updated successfully",
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while updating appointment" + error,
         });
      }
   }

   async delete(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const appointmentRepository = AppDataSource.getRepository(Appointment);
         await appointmentRepository.delete(id);

         res.status(200).json({
            message: "Appointment deleted successfully",
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while deleting appointment",
         });
      }
   }
}