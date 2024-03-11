import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePlanDetailsTable1704367341791 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "plan_details",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "diet_plan_id",
                    type: "int",
                },
                {
                    name: "meal_id",
                    type: "int",
                },
                {
                    name: "food_id",
                    type: "int",
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["diet_plan_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "diet_plans",
                },
                {
                    columnNames: ["meal_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "meals",
                },
                {
                    columnNames: ["food_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "foods",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("plan_details");
    }

}
