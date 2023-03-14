import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: process.env.SWAGGER_API_TITLE!,
            description: process.env.SWAGGER_API_DESCRIPTION!,
            version: process.env.SWAGGER_API_VERSION!,
        },
        servers: [
            {
                url: process.env.SWAGGER_API_BASE_PATH!,
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default [swaggerUi.serve, swaggerUi.setup(swaggerSpec)];
