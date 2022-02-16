import { PyramidsPharaohs } from '../models/PyramidsPharaohs.js';
import { Group } from '../models/Group.js';
import { GroupController } from './GroupContoller.js';

class PyramidsPharaohsController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new PyramidsPharaohs(1, 'Primer Juego', 'Es un juego de prueba', 'El Grupo');
        return group;
    }

    static getAll() {
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
        return list;
    }

    static aux_alertar = false;
    static update(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static delete(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static insert(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static toClass(obj) {
        var group = GroupController.getById(obj.group);
        var new_obj = new PyramidsPharaohs(obj.id, obj.name, obj.description, group);
        if(obj.levels && obj.levels.length > 0)
            new_obj.levels = obj.levels;
        return new_obj;
    }
}

export { PyramidsPharaohsController };
