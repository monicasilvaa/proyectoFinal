import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Appointment } from "./Appointment";

@Entity("services")
export class Service {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    name!: string;

    @OneToMany ( () => Appointment, (appointment) => appointment.service)

    appointments!: Appointment[];

}
