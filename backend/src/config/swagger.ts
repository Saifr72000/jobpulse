const PORT = process.env.PORT || 2000;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobPulse API",
      version: "1.0.0",
      description:
        "REST API for JobPulse: authentication, companies, campaign orders, media bank, reporting, and Stripe checkout. Authenticated routes expect an `access_token` httpOnly cookie (same as the SPA with credentials).",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local API (`PORT` from `.env`; default 2000)",
      },
    ],
    tags: [
      { name: "Auth", description: "Login, cookies, session, invitation password, Meta OAuth" },
      { name: "Users", description: "User registration and profiles" },
      { name: "Companies", description: "Companies and company user management" },
      { name: "Products", description: "Product catalogue (packages, services, add-ons)" },
      { name: "Orders", description: "Campaign orders, checkout, invoices, platform campaigns" },
      { name: "Media", description: "Uploads, folders, S3-backed media bank" },
      { name: "Folders", description: "Media folders per company" },
      { name: "Creatives", description: "Creative assets linked to orders" },
      { name: "Comments", description: "Order discussion threads" },
      { name: "Reporting", description: "Cross-platform metrics and token storage" },
      { name: "Dashboard", description: "Aggregated dashboard metrics" },
      { name: "Webhooks", description: "External provider callbacks (Stripe)" },
      { name: "Development mocks", description: "Local-only mock ad APIs for dev/testing" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
          description: "JWT access token set as httpOnly cookie after login",
        },
      },
    },
  },
  apis: ["./src/swagger-docs/*.ts"],
};
