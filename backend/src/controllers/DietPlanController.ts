import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { AppDataSource } from "../database/data-source";
import { Client } from "../models/Client";
import { DietPlan } from "../models/DietPlan";
import { Dietitian } from "../models/Dietitian";
import { Meal } from "../models/Meal";
import { PlanDetail } from "../models/PlanDetail";
import { Controller } from "./Controller";

// -----------------------------------------------------------------------------

export class DietplanController implements Controller {
   async create(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const data = req.body;

         const dietPlanRepository = AppDataSource.getRepository(DietPlan);
         const clientRepository = AppDataSource.getRepository(Client);
         const dietitianRepository = AppDataSource.getRepository(Dietitian);

         data.client = await clientRepository.findOneBy({
            id: data.client,
         });
         
         data.dietitian = await dietitianRepository.findOneBy({
            id: data.dietitian,
         });

         //TODO: actualizar total_kcal cuando se inserten los datos finales de alimentos
         data.total_kcal = 0;

         const newDietPlan = await dietPlanRepository.save(data);

         newDietPlan.planDetails?.map((detail: { dietPlan: any; }) => {
            detail.dietPlan = newDietPlan;
         });


         await dietPlanRepository.manager.save(PlanDetail, newDietPlan.planDetails);
         
         res.status(201).json({
            message: "DietPlan created successfully",
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while creating dietPlan" + error,
         });
      }
   }
   update(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
      throw new Error("Method not implemented.");
   }
   delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
      throw new Error("Method not implemented.");
   }
   async getAll(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const dietplanRepository = AppDataSource.getRepository(DietPlan);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allDietplans, count] = await dietplanRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allDietplans,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting dietplans",
         });
      }
   }

   async getMeals(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const mealRepository = AppDataSource.getRepository(Meal);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allMeals, count] = await mealRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allMeals,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting meals",
         });
      }
   }

   async getById(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const dietplanRepository = AppDataSource.getRepository(DietPlan);
         const dietplan = await dietplanRepository.findOne({
            where: {
               id: id
            },
            relations: ['planDetails', 'planDetails.meal', 'planDetails.food', 'planDetails.food.foodAttributes']
         });

         if (!dietplan) {
            return res.status(404).json({
               message: "Dietplan not found",
            });
         }

         res.status(200).json(dietplan);
      } catch (error) {
         res.status(500).json({
            message: "Error while getting dietplan",
         });
      }
   }

   async getByClientId(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const dietPlanRepository = AppDataSource.getRepository(DietPlan);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allDietplans, count] = await dietPlanRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            where: {
               client:{
                  id: id
               }
            },
            relations: ['client', 'client.user', 'dietitian','dietitian.user']
         });

         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allDietplans,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting client",
         });
      }
   }
}