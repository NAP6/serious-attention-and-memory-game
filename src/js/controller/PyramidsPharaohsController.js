import { PyramidsPharaohs } from '../models/PyramidsPharaohs.js';

class PyramidsPharaohsController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new PyramidsPharaohs(1, 'Primer Juego', 'Es un juego de prueba');
        return group;
    }

    static getAll() {
        var list = [];
        for(var i=0; i < 10; i++) {
            list.push(new PyramidsPharaohs(i, `Juego ${i}`, `Descripcion ${i}`));
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
}

export { PyramidsPharaohsController };
