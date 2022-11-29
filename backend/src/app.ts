import express, {Application,Request, Response, NextFunction} from "express";
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import routes from './routes';

const app:Application = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());

// v1 api routes
app.use(routes);

export default app;
