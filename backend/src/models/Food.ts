import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FoodAttribute } from "./FoodAttribute";
import { PlanDetail } from "./PlanDetail";

@Entity("foods")
export class Food {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @OneToMany(() => PlanDetail, (planDetails) => planDetails.food)
    planDetails?: PlanDetail[];

    @OneToMany(() => FoodAttribute, (foodAttribute) => foodAttribute.food)
    foodAttributes?: FoodAttribute[];
}
