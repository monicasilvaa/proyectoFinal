import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { AppDataSource } from "../database/data-source";
import { Center } from "../models/Center";
import { Service } from "../models/Service";
import { Controller } from "./Controller";

// -----------------------------------------------------------------------------

export class ServiceController implements Controller {
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
         const serviceRepository = AppDataSource.getRepository(Service);

         let { page, skip } = req.query;

         let currentPage = page ? +page : 1;
         let itemsPerPage = skip ? +skip : 10;

         const [allServices, count] = await serviceRepository.findAndCount({
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
            
         });
         res.status(200).json({
            count,
            skip: itemsPerPage,
            page: currentPage,
            results: allServices,
         });
      } catch (error) {
         res.status(500).json({
            message: "Error while getting services",
         });
      }
   }

   async getById(req: Request, res: Response): Promise<void | Response<any>> {
      try {
         const id = +req.params.id;

         const centerRepository = AppDataSource.getRepository(Center);
         const center = await centerRepository.findOneBy({
            id: id,
         });

         if (!center) {
            return res.status(404).json({
               message: "Center not found",
            });
         }

         res.status(200).json(center);
      } catch (error) {
         res.status(500).json({
            message: "Error while getting center",
         });
      }
   }
}