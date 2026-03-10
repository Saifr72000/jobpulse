const PORT = process.env.PORT || 3002;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobPulse API",
      version: "1.0.0",
      description: "API documentation for the JobPulse backend",
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: "Development server" },
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
