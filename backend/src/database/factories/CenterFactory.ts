import { Faker, faker } from "@faker-js/faker";
import { BaseFactory } from "./BaseFactory";
import { Center } from "../../models/Center";


export class CenterFactory extends BaseFactory<Center> {
    protected generateSpecifics(center: Center): Center {
      center.address = faker.location.streetAddress({ useFullAddress: true });
      center.phone = faker.string.numeric({ length: 9});

    return center;
  }
  
}
