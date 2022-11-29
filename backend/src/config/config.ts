import dotenv from 'dotenv';
import Joi from "joi";
import path from "path";

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(3000),
    APPLICATION_NAME: Joi.string().description('Application name is required'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url is required'),
    GRAPHIQL: Joi.string().valid('true', 'false').required(),
    GRAPHQL_URL: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  applicationName: envVars.APPLICATION_NAME,
  port: envVars.PORT,
  graphiql: envVars.GRAPHIQL,
  graphqlUrl: envVars.GRAPHQL_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};

export default config;
