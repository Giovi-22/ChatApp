import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors';
import {middleware} from './controllers/Middlewares/middlewares.js';

const app = express();
const port = 8083;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
//app.use(middleware);
const httpServer = app.listen(port,()=>{
    console.log(`Servidor escuchando en el puerto ${port}`);
    console.log(httpServer.address().address,httpServer.address().port);
});
const socketServer = new Server(httpServer,{cors:{origin:'http://127.0.0.1:5173'}});
app.set('socketServer',socketServer);

socketServer.on('connection',async (socket)=>{
    console.log(`Nuevo cliente conectado ${socket.id}`);
    console.log(socket.handshake.auth);
    socket.emit('session',socket.handshake.auth)
    
});
