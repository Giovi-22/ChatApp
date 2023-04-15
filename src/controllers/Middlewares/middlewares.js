import User from '../user.js';
import path from 'path';

const URL = path.resolve('./src/Models/db/Users.json');
const user = new User(URL);
export const middleware = (req,res,next)=>{
    console.log("dentro de middleware")
    const socketServer = req.app.get('socketServer');
    socketServer.use(async(socket,next)=>{
        const sessionID = socket.handshake.auth.sessionID;
        try {
            if(sessionID){
                const session = await user.getSession(sessionID);
                if(!session.error){
                    socket.auth = {...session};
                    return next();
                }
                //se crea una nueva session
                user.add(socket.handshake.auth.userName);
                socket.auth = user.get(1);
            }
            next();
        } catch (error) {
            console.log(error.message);
        }
    })
    next();
}