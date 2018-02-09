import { SimpleChainRPCServer } from '../src';
import morgan from 'morgan';
import connect from 'connect';
const app = connect();

app.use(morgan('combined'));

//use jayson as the middleware https://github.com/tedeh/jayson#server
app.use(SimpleChainRPCServer.middleware());

app.listen(3000);
