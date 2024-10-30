// db.config.js
import { Sequelize } from "sequelize";

 
const sequelize = new Sequelize(
  process.env.VITE_REACT_PSQL ||
    "postgres://default:KhCNb8m5vsai@ep-aged-base-a1551f72.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
  {
    logging: true,
    dialect: "postgres",
  }
);

export const db = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default sequelize; 
