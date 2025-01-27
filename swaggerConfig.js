import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mix Bunch Official Swagger",
      version: "1.0.0",
      description: "API documentation for the application",
    },
    servers: [
      { url: "http://localhost:3012" },
      { url: "https://flauntfit-v1-server.onrender.com" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, describes the format of the token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply globally if needed
      },
    ],
  },
  apis: ["./Routes/*.js"], // Path to your route files
};

const swaggerSpecs = swaggerJsDoc(options);

export default swaggerSpecs;
