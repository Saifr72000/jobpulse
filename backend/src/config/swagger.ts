export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bachelor Project API",
      version: "1.0.0",
      description: "API documentation for the bachelor project backend",
    },
    servers: [
      { url: "http://localhost:2000", description: "Development server" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
      },
    },
  },
  apis: ["./src/swagger-docs/*.ts"],
};
