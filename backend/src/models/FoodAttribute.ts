import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./Food";

@Entity("foods_attributes")
export class FoodAttribute {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column("decimal")
    value!: number;

    @ManyToOne(() => Food, (food) => food.foodAttributes)
    @JoinColumn({ name: "food_id" })
    food?: Food;
}
