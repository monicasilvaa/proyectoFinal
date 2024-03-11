import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3307,
    username: "root",
    password: "1234",
    database: "softwareNutricional",
    entities: [`${__dirname}/../models/**/*{.js,.ts}`],
    migrations: [`${__dirname}/migrations/**/*{.js,.ts}`],
    synchronize: false,
    logging: false,
 });