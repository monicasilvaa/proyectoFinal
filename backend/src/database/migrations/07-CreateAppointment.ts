import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointment1704367341786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
               name: "appointments",
               columns: [
                  {
                     name: "id",
                     type: "int",
                     isPrimary: true,
                     isGenerated: true,
                     generationStrategy: "increment",
                  },
                  {
                     name: "client_id",
                     type: "int",
                  },
                  {
                     name: "dietitian_id",
                     type: "int",
                  },
                  {
                     name: "appointment_date",
                     type: "timestamp",
                  },
                  {
                     name: "service_id",
                     type: "int",
                  },
                  {
                     name: "center_id",
                     type: "int",
                  },
                  {
                     name: "register_date",
                     type: "timestamp",
                     default: "CURRENT_TIMESTAMP",
                  },
                  {
                     name: "modified_date",
                     type: "timestamp",
                     default: "CURRENT_TIMESTAMP",
                  },
                  {
                     name: "modified_by",
                     type: "varchar",
                     length: "40",
                  },
                  {
                     name: "deleted_date",
                     type: "timestamp",
                     isNullable: true,
                  },
               ],
               foreignKeys: [
                  {
                     columnNames: ["client_id"],
                     referencedTableName: "clients",
                     referencedColumnNames: ["id"],
                  },
                  {
                     columnNames: ["dietitian_id"],
                     referencedTableName: "dietitians",
                     referencedColumnNames: ["id"],
                  },
                  {
                     columnNames: ["service_id"],
                     referencedTableName: "services",
                     referencedColumnNames: ["id"],
                  },
                  {
                     columnNames: ["center_id"],
                     referencedTableName: "centers",
                     referencedColumnNames: ["id"],
                  },
               ],
            }),
            true
         );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("appointments");
    }


}
