import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateClientsTable1704367341784 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "clients",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "user_id",
                    type: "int",
                    isUnique: true,
                },
                {
                    name: "weight",
                    type: "decimal",
                },
                {
                    name: "height",
                    type: "decimal",
                },
                {
                    name: "age",
                    type: "int",
                },
                {
                    name: "gender",
                    type: "varchar",
                    length: "20"
                },
                {
                    name: "pathology",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "intolerance",
                    type: "varchar",
                    length: "255"

                }
            ],
            foreignKeys: [
                {
                    columnNames: ["user_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("clients");
    }

}
