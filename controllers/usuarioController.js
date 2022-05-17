import Usuario from "../models/Usuario.js";
import generarId from "../helper/generarId.js";
import generarJWT from "../helper/generarJWT.js";

const registrar = async (req, res) => {

    //evitar usuario registrado
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
        const error = new Error("Usuario Ya Registrado");
        return (res.status(400).json({ msg: error.message }));
    }
    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();

        res.json({ usuarioAlmacenado });
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        const error = new Error("Usuario No Registrado");
        return res.status(404).json({ msj: error.message });
    }

    if (!usuario.confirmado) {
        const error = new Error("Usuario No Confirmado");
        return res.status(403).json({ msj: error.message });
    }

    if (await usuario.comprobarPassword(password)) {

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    } else {
        const error = new Error("El password es Incorrecto");
        return res.status(403).json({ msj: error.message });
    }

    console.log(usuario);

}

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error("Token no registrado");
        return res.status(403).json({ msj: error.message });
    }

    try {
        usuarioConfirmar.token = "";
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        return res.json({ msj: "Usuario Registrado Correctamente" });


        console.log(usuarioConfirmar);

    } catch (error) {
        console.log(error);
    }

}

const olvidePassword = async (req, res) => {

    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        console.log(usuario);
        const error = new Error("Usuario No Existe");
        return (res.status(400).json({ msg: error.message }));
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        return (res.json({ msg: "hemos enviado un mail con las intrucciones" }));

    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: "token valido y el usuario existe" })
    } else {
        const error = new Error("Token no valido");
        return (res.status(400).json({ msg: error.message }));
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: "password modificado correctamente" });
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no valido");
        return (res.status(400).json({ msg: error.message }));
    }

    console.log(token + password);
}

const perfil = async (req, res) => {

    const {usuario} = req;

    res.json(usuario);
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
};