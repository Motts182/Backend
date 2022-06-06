import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js';

const obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find().where('creador').equals(req.usuario);
        res.json(proyectos);
Ñ
    } catch (error) {
        return res.status(404).json({ msg: 'hubo un error en obtenerProyectos' });
    }
}

const nuevoProyecto = async (req, res) => {

    const proyecto = Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id);

        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({ msg: 'no tiene los permisos' });
        }

        const tareas = await Tarea.find().where('proyecto').equals(proyecto.id);

        return res.json({
            proyecto,
            tareas
        });

    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: 'no se encontro el proyecto' });

    }

}

const editarProyecto = async (req, res) => {

    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id);

        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({ msg: 'no tiene los permisos' });
        }

        proyecto.nombre = req.body.nombre || proyecto.nombre;
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
        proyecto.cliente = req.body.cliente || proyecto.cliente;

        const proyectoAlmacenado = await proyecto.save()

        return res.json(proyectoAlmacenado);

    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: 'no se encontro el proyecto' });
    }

}

const eliminarProyecto = async (req, res) => {

    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id);

        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            return res.status(401).json({ msg: 'no tiene los permisos' });
        }

        await proyecto.deleteOne();

        return res.json({ msg: "Proyecto Eliminado" });

    } catch (error) {
        console.log(error)
        return res.status(404).json({ msg: 'no se encontro el proyecto' });
    }
}

const agregarColaborador = async (req, res) => { }

const eliminarColaborador = async (req, res) => { }


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
}