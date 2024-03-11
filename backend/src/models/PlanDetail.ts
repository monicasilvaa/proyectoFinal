import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DietPlan } from "./DietPlan";
import { Food } from "./Food";
import { Meal } from "./Meal";

@Entity("plan_details")
export class PlanDetail {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => DietPlan, (dietPlan) => dietPlan.planDetails)
    @JoinColumn({ name: "diet_plan_id" })
    dietPlan?: DietPlan;

    @ManyToOne(() => Meal, (meal) => meal.planDetails)
    @JoinColumn({ name: "meal_id" })
    meal?: Meal;

    @ManyToOne(() => Food, (food) => food.planDetails)
    @JoinColumn({ name: "food_id" })
    food?: Food;
}
