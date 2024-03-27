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
         const clientRepository = AppDataSource.getRepository(Client);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allUsers, count] = await clientRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            select: {
               id: true,
               user : {
                  id:true,
                  first_name: true,
                  last_name: true,
                  email:true
               }
            },
            relations: ['user', 'user.role'],
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
            relations: ['client','dietitian','role']
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

   async getClientById(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const clientRepository = AppDataSource.getRepository(Client);
         const client = await clientRepository.findOne({
            where: {id: id},
            relations: ['user']
         });

         if (!client) {
            return res.status(404).json({
               message: "Client not found",
            });
         }

         res.status(200).json(client);
      } catch (error) {
         res.status(500).json({
            message: "Error while getting client",
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
            relations: ['user']
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

         if(data.client && !data.client) {
            data.client = new Client();
            data.client.user = data;
         }
         else if(data.dietitian && !data.dietitian) {
            data.dietitian = new Dietitian();
            data.dietitian.user = data;
         }

         data.password_hash = bcrypt.hashSync(data.password, 10);


         const newUser = await userRepository.save(data);

         if(data.client) {
            Object.assign(newUser.client, data.client);
            newUser.client.user = newUser;

            await userRepository.manager.save(Client, newUser.client);
         }
         else if(data.dietitian) {
            Object.assign(newUser.dietitian, data.dietitian);
            newUser.dietitian.user = newUser;
            await userRepository.manager.save(Dietitian, newUser.dietitian);
         }

         res.status(201).json({message: "User created"});
      } catch (error) {
         res.status(500).json({
            message: "Error while creating user" + error,
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

         if(data.client) {
            data.client.user = user;
            if (user.client?.id) {
               data.client.id = user.client.id
            }
         }
         else if(data.dietitian ) {
            data.dietitian.user = user;

            if (user.dietitian?.id) {
               data.dietitian.id = user.dietitian.id
            }
         }

         user = {...user, ...data};
         
         if(user?.client) {
            await userRepository.manager.save(Client, user.client);
         }
         else if(user?.dietitian) {
            await userRepository.manager.save(Dietitian, user.dietitian);
         }

         if(user){
            await userRepository.save(user);
         }

         res.status(202).json({
            message: "Perfil actualizado correctamente",
         });
      } catch (error) {
         res.status(500).json({
            message: "Se ha producido un error al intentar guardar sus datos. Inténtelo de nuevo más tarde por favor",
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
            message: "Error while deleting user" + error,
         });
      }
   }

   async getAvailableRoles(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const roleRepository = AppDataSource.getRepository(Role);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allRoles, count] = await roleRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allRoles,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting roles",
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

         const userRepository = AppDataSource.getRepository(User);
         const user = await userRepository.findOne({
            where: {
               id: userId
            },
            relations: {
               dietitian: {
                  appointments: {
                     center: true,
                     service: true,
                     client: {
                        user: true
                     }
                  }
               }
            }
         });

         if (!user) {
            return res.status(404).json({
               message: "User not found",
            });
         }

         const dietitianAppointments = user.dietitian?.appointments;

         res.status(200).json({
            userId: user.dietitian?.id,
            appointments: dietitianAppointments
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting dietitianAppointments",
         });
      }
   }
}