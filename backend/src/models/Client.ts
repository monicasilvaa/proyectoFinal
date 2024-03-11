import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { DietPlan } from "./DietPlan";
import { User } from "./User";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.client, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  weight!: number;

  @Column()
  height!: number;

  @Column()
  age!: number;

  @Column()
  gender!: string;

  @Column()
  pathology!: string;

  @Column()
  intolerance!: string;

  @OneToOne(() => DietPlan, (dietPlan) => dietPlan.client)
  dietPlan?: DietPlan;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments?: Appointment[];

  @OneToMany(() => DietPlan, (dietPlan) => dietPlan.client)
  dietPlans?: DietPlan[];
}
