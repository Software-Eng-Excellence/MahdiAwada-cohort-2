import logger from './util/logger';
import config  from './config';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { NextFunction, Request , Response } from "express";
import { HttpException } from './util/exceptions/HttpException';


const app = express();

// config helmet
app.use(helmet());

// config body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// config cors
app.use(cors());

// add middlewares
app.use(requestLogger);

// config routes
app.use('/', routes);

// config 404 handler
app.use((req, res) => {
    res.status(404).json({error: "Not Found"});
})

// config error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ( err instanceof HttpException ) {
        const httpException = err as HttpException;
        logger.error(" %s [%d} : \"%s\" %o", httpException.name, httpException.status, httpException.message, httpException.details || {});
        res.status(httpException.status).json({ 
            message: httpException.message,
            details: httpException.details || undefined 
        });
    } else {
        logger.error("Unhandled Error: %s", err.message);
        res.status(500).json({
             message: "Internal Server Error"
             });
    }
})

app.listen(config.port, config.host, () => {
    logger.info('Server is running on http://%s:%d', config.host, config.port);
});

