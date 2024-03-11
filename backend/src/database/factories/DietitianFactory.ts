import { faker } from "@faker-js/faker";
import { Dietitian } from "../../models/Dietitian";
import { BaseFactory } from "./BaseFactory";


export class DietitianFactory extends BaseFactory<Dietitian> {
    protected generateSpecifics(dietitian: Dietitian): Dietitian{
        dietitian.specialization = faker.person.jobArea();

        return dietitian;
  }


  
}
