import mongoose from "mongoose";
import app from './app';
import {config, logger} from './config';

let server:any;

mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    logger.info(`GraphQL is located on http://localhost:${config.port}${config.graphqlUrl}`);
  });
});
