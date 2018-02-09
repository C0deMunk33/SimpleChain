import { SimpleChainRPCServer } from '../src';
import morgan from 'morgan';
import connect from 'connect';
const app = connect();
const jsonParser = require('body-parser').json;

app.use(morgan('combined'));
app.use(jsonParser());

//use jayson as the middleware https://github.com/tedeh/jayson#server
app.use(SimpleChainRPCServer.middleware());

app.listen(2702);
