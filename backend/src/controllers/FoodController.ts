import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { AppDataSource } from "../database/data-source";
import { DietPlan } from "../models/DietPlan";
import { Food } from "../models/Food";
import { Meal } from "../models/Meal";
import { Controller } from "./Controller";

// -----------------------------------------------------------------------------

export class FoodController implements Controller {
   create(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
      throw new Error("Method not implemented.");
   }
   update(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
      throw new Error("Method not implemented.");
   }
   delete(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<void | Response<any, Record<string, any>>> {
      throw new Error("Method not implemented.");
   }
   async getAll(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const foodRepository = AppDataSource.getRepository(Food);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allFoods, count] = await foodRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            relations: ['foodAttributes']
            
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allFoods,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting foods",
         });
      }
   }

   async getMeals(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         console.log("MEALS");
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

         const foodRepository = AppDataSource.getRepository(DietPlan);
         const dietplan = await foodRepository.findOneBy({
            id: id,
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

         const foodRepository = AppDataSource.getRepository(DietPlan);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allDietplans, count] = await foodRepository.findAndCount({
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