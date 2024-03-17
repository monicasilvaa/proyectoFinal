import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Center } from "./Center";
import { Client } from "./Client";
import { DietPlan } from "./DietPlan";
import { Dietitian } from "./Dietitian";
import { Service } from "./Service";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "date" })
  appointment_date!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  register_date?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  modified_date?: Date;

  @Column({ length: "40" })
  modified_by?: string;

  @Column({ type: "timestamp", nullable: true })
  deleted_date?: Date;

  @ManyToOne(() => Client, (client) => client.appointments, {
  })
  @JoinColumn({ name: "client_id" })
  client!: Client;

  @ManyToOne(() => Dietitian, (dietitian) => dietitian.appointments, {
  })
  @JoinColumn({ name: "dietitian_id" })
  dietitian!: Dietitian;

  @ManyToOne(() => Service, (service) => service.appointments, {
  })
  @JoinColumn({ name: "service_id" })
  service!: Service;

  @ManyToOne(() => Center, (center) => center.appointments, {
  })
  @JoinColumn({ name: "center_id" })
  center!: Center;


  @OneToMany(() => DietPlan, (dietPlan) => dietPlan.appointment)
  dietPlans?: DietPlan[];

}
