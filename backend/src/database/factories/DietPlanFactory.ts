import { faker } from "@faker-js/faker";
import { DietPlan } from "../../models/DietPlan";
import { BaseFactory } from "./BaseFactory";


export class DietPlanFactory extends BaseFactory<DietPlan> {
    protected generateSpecifics(dietPlan: DietPlan): DietPlan{

        dietPlan.goal = faker.lorem.word(100);
        dietPlan.total_kcal = faker.number.float();

    
    return dietPlan;
  }


  
}
