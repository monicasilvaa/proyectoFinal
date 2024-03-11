import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDietPlanTable1704367341787 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "diet_plans",
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
                    name: "appointment_id",
                    type: "int",
                    isNullable: true,
                },
                {
                    name: "total_kcal",
                    type: "decimal",
                },
                {
                    name: "goal",
                    type: "varchar",
                    length: "250"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                     default: "CURRENT_TIMESTAMP",
                },
            ],
            foreignKeys: [
                {
                    columnNames: ["client_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "clients",
                },
                {
                    columnNames: ["dietitian_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "dietitians",
                },
                {
                    columnNames: ["appointment_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "appointments",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("diet_plans");
    }

}
