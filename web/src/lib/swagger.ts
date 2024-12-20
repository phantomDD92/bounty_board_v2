import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Docs',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'session',
          },
        },
      },
      security: [
        { sessionCookie: [] },
      ],
      tags: [
        { name: 'Auth', },
        { name: "Tags" },
        { name: "Infra" }
      ],
    },
  });
  return spec;
};
