import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1704367341782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
               name: "users",
               columns: [
                  {
                     name: "id",
                     type: "int",
                     isPrimary: true,
                     isGenerated: true,
                     generationStrategy: "increment",
                  },
                  {
                     name: "username",
                     type: "varchar",
                     length: "40",
                     isUnique: true,
                  },
                  {
                     name: "first_name",
                     type: "varchar",
                     length: "255",
                  },
                  {
                     name: "last_name",
                     type: "varchar",
                     length: "255",
                  },
                  {
                     name: "email",
                     type: "varchar",
                     length: "255",
                     isUnique: true,
                  },
                  {
                    name: "password_hash",
                    type: "varchar",
                    length: "255",
                 },
                 {
                     name: "phone",
                     type: "varchar",
                     length: "15",
                  },
                  {
                     name: "role_id",
                     type: "int",
                  },
                  {
                     name: "birthday_date",
                     type: "date",
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
                     name: "deleted_date",
                     type: "timestamp",
                     isNullable: true,
                  },
               ],
               foreignKeys: [
                  {
                     columnNames: ["role_id"],
                     referencedTableName: "roles",
                     referencedColumnNames: ["id"],
                  },
               ],
            }),
            true
         );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
