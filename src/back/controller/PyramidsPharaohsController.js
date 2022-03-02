import { PyramidsPharaohs } from '../../models/PyramidsPharaohs.js';
import { Group } from '../../models/Group.js';
import { GroupController } from './GroupContoller.js';

class PyramidsPharaohsController {

    static async getById(id) {
        var game = new PyramidsPharaohs(id, `Juego ${id}`, `Descripcion ${id}`, new Group(id, 'Grupo '+id, 'Des'));
        game.add_level(
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-doc-brown.jpg'), 
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-marty-mcfly.jpg')
            ,[1])
        game.add_level(
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-marty-mcfly.jpg'),
            Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-doc-brown.jpg'), 
            [0,2])
        return game;
    }

    static async getById_external(req, res) {
        var id = req.body.id;
        console.log(id);
        var pdp = await PyramidsPharaohsController.getById(id);
        res.json(pdp);
    }

    static async getAll(req, res) {
        var list = [];
        for(var i=0; i < 5; i++) {
            var game = new PyramidsPharaohs(i, `Juego ${i}`, `Descripcion ${i}`, new Group(i, 'Grupo '+i, 'Des'));
            if(i % 2 == 0) {
                game.add_level(
                    Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-doc-brown.jpg'), 
                    Array(3).fill('https://www.paturros.es/wp-content/uploads/2021/01/comprar-patito-goma-marty-mcfly.jpg')
                    ,[1])
            }
            list.push(game);
        }
        res.json(list);
    }

    static async update(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        res.json({is_updated: true});
    }

    static async delete(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        res.json({is_deleted: true});
    }

    static async insert(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        res.json({is_inserted: true});
    }

    static async toClass(obj) {
        var group = await GroupController.getById(obj.group);
        var new_obj = new PyramidsPharaohs(obj.id, obj.name, obj.description, group, obj.maximum_attempsts);
        if(obj.levels && obj.levels.length > 0)
            new_obj.levels = obj.levels;
        return new_obj;
    }
}

export { PyramidsPharaohsController };
