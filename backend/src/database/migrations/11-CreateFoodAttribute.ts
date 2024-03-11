import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFoodsAttributesTables1704367341790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "foods_attributes",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "food_id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "200"
                },
                {
                    name: "value",
                    type: "decimal",
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["food_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "foods",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("foods_attributes");
    }

}
