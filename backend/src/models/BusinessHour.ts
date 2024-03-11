import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Center } from "./Center";

@Entity("business_hours")
export class BusinessHour {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  dayOfWeek!: string;

  @Column({ type: "time" })
  openingTime!: string;

  @Column({ type: "time" })
  closingTime!: string;

  @ManyToOne(() => Center, (center) => center.businessHours)
  @JoinColumn({ name: "center_id" })
  center!: Center;


}
