import express from 'express';
import * as dotenv from 'dotenv';
import routes from './src/routes/index.js';

dotenv.config();
import connect from './src/database/database.js';
import { OutputType, print } from './src/helpers/print.js';
import Exception from './src/exceptions/Exception.js';
import helmet from 'helmet';
import cors from 'cors';

/**
 * App Variables
 */
if (!process.env.PORT) {
  print(Exception.APP_VARIABLES_REQUIRED, OutputType.ERROR);
  process.exit(1);
}

const app = express();

const port = process.env.PORT ?? 3000;

/**
 * App configuration
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use('/users', routes.users);
app.use('/unitPrices', routes.unitPrices);

app.get('/', (req, res) => {
  res.send('response from root router');
});

app.listen(port, async () => {
  await connect();
  print(`Listening on port: ${port}`, OutputType.INFORMATION);
});
