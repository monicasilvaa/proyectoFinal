import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRoles } from "../constants/UserRoles";
import { AppDataSource } from "../database/data-source";
import { Center } from "../models/Center";
import { Client } from "../models/Client";
import { Dietitian } from "../models/Dietitian";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { Controller } from "./Controller";

// -----------------------------------------------------------------------------

export class UserController implements Controller {
   async getAll(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const userRepository = AppDataSource.getRepository(User);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allUsers, count] = await userRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            relations: ['role'],
            select: {
               username: true,
               email: true,
               id: true,
               register_date: true
            },
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allUsers,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting users",
         });
      }
   }

   //Listar todos los clientes registrados (Superadmin)
   async getAllRegisteredClients(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const userRepository = AppDataSource.getRepository(User);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allUsers, count] = await userRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            select: {
               username: true,
               email: true,
               id: true,
            },
            where: {
               role: UserRoles.CLIENT
            }
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allUsers,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting users",
         });
      }
   }

   async getById(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const userRepository = AppDataSource.getRepository(User);
         const user = await userRepository.findOne({
            where: {id: id},
            relations: ['client']
         });

         if (!user) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         res.status(200).json(user);
      } catch (error) {
         res.status(500).json({
            message: "Error while getting user",
         });
      }
   }

   //Listar dietistas

   async getDietitianList(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const dietitianRepository = AppDataSource.getRepository(Dietitian);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allDietitians, count] = await dietitianRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            select: {
               user: {username: true, email: true, first_name: true, last_name: true},
               id: true,
            },
            relations: ['user'],
            where: {
               user:{role: UserRoles.DIETITIAN}
            },
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allDietitians,
         });

      } catch (error) {
         res.status(500).json({
            message: "Error while getting Dietitians",
         });
      }
   }

   async create(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const data = req.body;

         const userRepository = AppDataSource.getRepository(User);
         const newUser = await userRepository.save(data);
         res.status(201).json(newUser);
      } catch (error) {
         res.status(500).json({
            message: "Error while creating user",
         });
      }
   }

   //Listar dietistas por centro
  async getDietitiansByCenter(req: Request, res: Response): Promise<void | Response<any>> {
   try {
     
     const centerId = +req.params.centerId;

     const centerRepository = AppDataSource.getRepository(Center);

     const center = await centerRepository.findOne({
       where: {
         id: centerId
       },
       relations: ['dietitians', 'dietitians.user']
     });

     if (!center) {
         return res.status(400).json({
            message: "Center not found",
         });
      }

     res.status(200).json(center.dietitians);
   } catch (error) {
     res.status(500).json({
       message: "Error while getting dietitians by center" + error,
     });
   }
 }


   //Crear nuevo Dietitian (Superadmin)
   async createDietitian(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const { username, password, email, first_name, last_name, birthday_date, phone } = req.body;
         const userRepository = AppDataSource.getRepository(User);

         const newUser: User = {
            username,
            email,
            password_hash: bcrypt.hashSync(password, 10),
            first_name,
            last_name,
            birthday_date,
            phone,
            role: UserRoles.DIETITIAN,
         };

         await userRepository.save(newUser);

         res.status(StatusCodes.CREATED).json({
            message: "Dietitian created successfully",
         });
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error while creating dietitian",
         });
      }
   }
   async update(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;
         const data = req.body;

         const userRepository = AppDataSource.getRepository(User);
         
         let user = await userRepository.findOne({where: {id: id}, relations: ["client", "dietitian"] });

         if (!user) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         Object.assign(user, data);
        
         if(data.client && !user.client) {
            user.client = new Client();
            user.client.user = user;
         }
         else if(data.dietitian && !user.dietitian) {
            user.dietitian = new Dietitian();
            user.dietitian.user = user;
         }

         if(user.client) {
            Object.assign(user.client, data.client);
            await userRepository.manager.save(user.client);
         }
         else if(user.dietitian) {
            Object.assign(user.dietitian, data.dietitian);
            await userRepository.manager.save(user.dietitian);
         }

         await userRepository.save(user);

         res.status(202).json({
            message: "User updated successfully",
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while updating user" + error,
         });
      }
   }

   //Otorgar roles a un usuario
   async updateUserRole(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;
         const data = req.body;

         const userRepository = AppDataSource.getRepository(User);
         const roleRepository = AppDataSource.getRepository(Role);

         const user = await userRepository.findOneBy({
            id: id,
         });

         if (!user) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         const role = await roleRepository.findOneBy({
            id: data.role,
         }) as Role;

         user.role = role;

         await userRepository.update({ id: id }, user);

         res.status(202).json({
            message: "User role updated successfully",            
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while updating user role"
         });
      }
   }

   //Eliminar usuarios (superadmin)
   async delete(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const userRepository = AppDataSource.getRepository(User);
         await userRepository.delete(id);

         res.status(200).json({
            message: "User deleted successfully",
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while deleting user",
         });
      }
   }

   async getClientAppointments(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const userId = +req.tokenData.userId;

         const clientRepository = AppDataSource.getRepository(Client);
         const client = await clientRepository.findOne({
            where: {
               user: {id: userId}
            },
            relations: ['appointments','appointments.service', 'appointments.center', 'appointments.dietitian', 'appointments.dietitian.user', 'user']
         });

         if (!client) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         const clientAppointments = client.appointments;

         res.status(200).json({
            userId: client.id,
            clientAppointments,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting dietitianAppointments",
         });
      }
   }

   async getDietitianAppointments(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const userId = +req.tokenData.userId;

         const dietitianRepository = AppDataSource.getRepository(Dietitian);
         const dietitian = await dietitianRepository.findOne({
            where: {
               id: userId
            },
            relations: {
               appointments: true
            }
         });

         if (!dietitian) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         const dietitianAppointments = dietitian.appointments;

         res.status(200).json({
            userId: dietitian.id,
            dietitianAppointments,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting dietitianAppointments",
         });
      }
   }
}