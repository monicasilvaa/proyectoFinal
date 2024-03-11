import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCenter1704367341785 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
               name: "centers",
               columns: [
                  {
                     name: "id",
                     type: "int",
                     isPrimary: true,
                     isGenerated: true,
                     generationStrategy: "increment",
                  },
                  {
                    name: "address",
                    type: "varchar",
                    length: "255",
                 },
                 {
                    name: "phone",
                    type: "varchar",
                    length: "15",
                 },
               ],
            }),
            true
         );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("centers");
    }

}
