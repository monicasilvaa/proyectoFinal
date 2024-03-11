import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./Appointment";
import { BusinessHour } from "./BusinessHour";
import { Dietitian } from "./Dietitian";

@Entity("centers")
export class Center {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    address!: string;

    @Column()
    phone!: string;

    @OneToMany ( () => Appointment, (appointment) => appointment.center)

    appointments!: Appointment[];

    @ManyToMany(() => Dietitian, (dietitian) => dietitian.centers)
    @JoinTable({ 
      name: 'dietitiansCenters',
      joinColumn: { name: "center_id"},
      inverseJoinColumn: { name: "dietitian_id" },
   })
    dietitians!: Dietitian[];

    @OneToMany(() => BusinessHour, (businessHour) => businessHour.center)
    businessHours!: BusinessHour[];

}
