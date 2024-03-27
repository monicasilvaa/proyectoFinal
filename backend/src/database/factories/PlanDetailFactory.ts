import { faker } from "@faker-js/faker";
import { PlanDetail } from "../../models/PlanDetail";
import { BaseFactory } from "./BaseFactory";


export class PlanDetailFactory extends BaseFactory<PlanDetail> {
    protected generateSpecifics(planDetail: PlanDetail): PlanDetail{

        planDetail.quantity = faker.number.int({ min: 0, max: 500 });
    
    return planDetail;
  }


  
}
