import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatedietitianCenter1704447713484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
               name: "dietitianCenters",
               columns: [
                  {
                     name: "dietitian_id",
                     type: "int",
                     isPrimary: true,
                  },
                  {
                    name: "center_id",
                    type: "int",
                    isPrimary: true,
                 },
               ],
               foreignKeys: [
                {
                   columnNames: ["dietitian_id"],
                   referencedTableName: "dietitians",
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
        await queryRunner.dropTable("dietitianCenters");
    }

}