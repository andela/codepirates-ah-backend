import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();
// Swagger js doc setup
const swaggerDefinition = {
  info: {
    title: 'Authors Haven',
    version: '1.0.0',
    description: 'A Social platform for the creative at heart. Create a community of like minded authors to foster inspiration and innovation by leveraging the modern web.'
  },
  host: `${process.env.BASE_URL}:${process.env.PORT}/api/`,
  basePath: `${process.env.API_VERSION}`,
  schemes: ['http', 'https']
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/**/*.yml']
};

const swaggerSpecification = swaggerJSDoc(options);

export default swaggerSpecification;
