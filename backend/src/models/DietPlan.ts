import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { Client } from "./Client";
import { Dietitian } from "./Dietitian";
import { PlanDetail } from "./PlanDetail";

@Entity("diet_plans")
export class DietPlan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    client_id!: number;

    @Column({ type: "int" })
    dietitian_id!: number;

    @Column({ type: "int" })
    appointment_id?: number;

    @Column({ type: "decimal" })
    total_kcal!: number;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)"
    })
    created_at!: Date;

    @Column()
    goal!: String;

    @OneToMany(() => PlanDetail, (planDetail) => planDetail.dietPlan)
    planDetails?: PlanDetail[];

    @ManyToOne(() => Client, (client) => client.dietPlans)
    @JoinColumn({ name: "client_id" })
    client!: Client;

    @ManyToOne(() => Dietitian, (dietitian) => dietitian.dietPlans)
    @JoinColumn({ name: "dietitian_id" })
    dietitian!: Dietitian;

    @ManyToOne(() => Appointment, (appointment) => appointment.dietPlans)
    @JoinColumn({ name: "appointment_id" })
    appointment?: Appointment;
}
