import { faker } from "@faker-js/faker";
import { Client } from './../../models/Client';
import { BaseFactory } from "./BaseFactory";


export class ClientFactory extends BaseFactory<Client> {
    protected generateSpecifics(client: Client): Client{
    
    client.age = faker.number.int({ min: 18, max: 100 });
    client.height = faker.number.float({ min:150, max:200 });
    client.weight = faker.number.float({ min:50, max:100 });
    client.gender = faker.person.sex();
    client.intolerance = faker.lorem.word({ length: { min: 15, max: 200 }});
    client.pathology = faker.lorem.word({ length: { min: 15, max: 200 }});
   

    return client;
  }


  
}
