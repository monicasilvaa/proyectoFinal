import { ObjectLiteral, Repository } from "typeorm";

/* La clase `BaseFactory` proporciona métodos básicos para generar instancias de entidades
 * utilizando un repositorio de TypeORM.*/

export class BaseFactory<T extends ObjectLiteral> {
   //Repositorio TypeORM utilizado para la creación de instancias.
   protected modelRepository: Repository<T>;

   //Constructor de la clase.
   constructor(modelRepository: Repository<T>) {
      this.modelRepository = modelRepository;
   }

   /* Método protegido que genera propiedades específicas para una instancia del modelo.
    * Debe ser sobrescrito por las clases hijas según las necesidades específicas.*/
   protected generateSpecifics(model: T): T {
      // Se sobreescribe en la clase hija según las necesidades específicas.
      return model;
   }

   /*Método protegido que genera una instancia del modelo con propiedades específicas.
    * Utiliza el método generateSpecifics que puede ser sobrescrito por clases hijas.*/
   protected generate(): T {
      let model = this.modelRepository.create();
      model = this.generateSpecifics(model);
      return model;
   }

   //Método público que crea un número especificado de instancias del modelo.
   createMany(count: number = 1): T[] {
      const generated: T[] = [];

      for (let i = 0; i < count; i++) {
         const item = this.generate();
         generated.push(item);
      }

      return generated;
   }
}