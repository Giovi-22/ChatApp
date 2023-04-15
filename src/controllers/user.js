import fs from 'fs/promises';

class User{

    #sessionID;
    #userID;
    #userName;
    #users;
    #path;

    constructor(URL){
        this.#sessionID = `session${this.#userID}`;
        this.#userID = 1;
        this.#users = [];
        this.#path = URL;
        this.#userName="";
    }
    async #_loadData(){
        try {
            const result = await fs.readFile(this.#path,"utf-8");
            const users = JSON.parse(result);
            this.#users=[...users];
            this.#userID = users.at(-1);
            this.#sessionID = `session${users.at(-1)}`
            return this.#users;
        } catch (error) {
            await fs.writeFile(this.#path,JSON.stringify([]));
            return this.#users;
        }
    }
    async add(userName){
        try {
            if(!userName.trim()){
                throw new Error("Ingrese valores validos");
            }
            await this.#_loadData();
            const user = this.#users.find(user=>user.userName === userName);
            if(user){
                throw new Error("El nombre de usuario ya existe, elige otro");
            }
            const credentials = {userName,sessionID: this.#sessionID,userID:this.#userID}
            await fs.writeFile(this.path,JSON.stringify(credentials))
            return {error:false,data:"Usuario guardado"};
        } catch (error) {
            return {error:true,message:`No se pudo guardar el usuario: \n${error.message}`};
        }
    }
    
    async get(userID){
        this.#userID = +userID;
        try {
            await this.#_loadData();
            const user = this.#users.find(user => user.userID === this.#userID);
            if(!user){
                throw new Error("El usuario no existe");
            }
            return {error:false,data:user};
        } catch (error) {
            return {error:true,message:`No se pudo obtener el usuario: \n${error.message}`};
        } 
    }
    async getSession(sessionID){
         this.#sessionID = sessionID;
         try {
            const result = this.#_loadData();
            const session = this.#users.find(user => user.sessionID === sessionID);
            if(!session){
                throw new Error("La session no existe");
            }
            return {error:false,data:session}
         } catch (error) {
            return {error:true,message:`No se pudo obtener la session: \n${error.message}`};
         }   
    }
}

export default User;