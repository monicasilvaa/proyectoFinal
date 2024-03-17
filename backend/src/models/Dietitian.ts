import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { Center } from "./Center";
import { DietPlan } from "./DietPlan";
import { User } from "./User";
  
  @Entity("dietitians")
  export class Dietitian {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    specialization!: string;
    @OneToOne(() => User, (user) => user.dietitian)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @OneToMany(() => Appointment, (appointment) => appointment.dietitian)
    appointments?: Appointment[];

    @OneToMany(() => DietPlan, (dietPlan) => dietPlan.dietitian)
    dietPlans?: DietPlan[];

    @ManyToMany(() => Center, (center) => center.dietitians)
    @JoinTable({ 
        name: 'dietitianCenters',
        joinColumn: { name: "dietitian_id"},
        inverseJoinColumn: { name: "center_id" },
    })
    centers?: Center[];

  }
  