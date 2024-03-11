import { faker } from "@faker-js/faker";
import { BaseFactory } from "./BaseFactory";
import { Appointment } from "../../models/Appointment";


export class AppointmentFactory extends BaseFactory<Appointment> {
    protected generateSpecifics(appointment: Appointment): Appointment{
        appointment.appointment_date = faker.date.soon({ days: 7 })

    return appointment;
  }


  
}
