import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlanDetail } from "./PlanDetail";

@Entity("meals")
export class Meal {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @OneToMany ( () => PlanDetail, (planDetail) => planDetail.meal)

    planDetails!: PlanDetail[];

}
