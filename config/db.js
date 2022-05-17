import mongoose from "mongoose";

const conectDB = async () => {

    try {
        const connexion = await mongoose.connect( process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        const url = `${connexion.connection.host}:${connexion.connection.port}`;
        console.log(`MongoDB Conectado en: ${url}`);


    } catch (error) {
        
        console.log(`error: ${error.message}`);
        process.exit(1);
    }

}

export default conectDB;