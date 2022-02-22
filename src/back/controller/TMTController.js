import { TMT, TMTPoint } from '../../models/TMT.js';
import { Group } from '../../models/Group.js';
import { GroupController } from './GroupContoller.js';

class TMTController {

    static async getById(id) {
        if(!id) throw(['Se nececita un id']);
        var tmt = new TMT(1, 'Primer juego TMT', 'Juego de TMT', new Group(1, 'Grupo 1', 'una description'), 1);
        var level_1 = tmt.add_level('https://www.researchgate.net/profile/Alexander-Eriksson-3/publication/299465148/figure/fig5/AS:497128448499717@1495536066867/The-Trail-Making-Test-B-test-screen.png');
        var level_2 = tmt.add_level('https://3.bp.blogspot.com/-vzDanfc42Og/V1_GhqrpCFI/AAAAAAAAADo/_DjUrRXQFEwFFinPUPP7W9IddaLSMtx4QCLcB/s1600/Evernote%2BSnapshot%2B20160614%2B130136.png');

        level_1.points.push(new TMTPoint(60,650,483,216,16,728,629));
        level_1.points.push(new TMTPoint(60,577,129,216,16,728,626));

        level_2.points.push(new TMTPoint(31, 347, 382, 131, 16, 897, 634));
        level_2.points.push(new TMTPoint(31, 717, 491, 131, 16, 897, 634));
        level_2.points.push(new TMTPoint(31, 856, 479, 131, 16, 897, 634));

        return tmt;
    }

    static async getById_external(req, res) {
        var id = req.body.id;
        var tmt = await TMTController.getById(id);
        res.json(tmt);
    }

    static async toClass(obj) {
        var group = await GroupController.getById(obj.group);
        var new_obj = new TMT(obj.id, obj.name, obj.description, group, obj.maximum_attempsts);
        if(obj.levels && obj.levels.length > 0)
            new_obj.levels = obj.levels;
        return new_obj;
    }

    static async getAll(req, res) {
        var list = [];
        for(var i=0; i < 5; i++) {
            list.push(new TMT(i, `TMT ${i}`, `Descripcion ${i}`, new Group(i, 'Grupo '+i, 'Des')));
        }
        res.json(list);
    }

    static async update(req, res) {
        var tmt = req.body.tmt;
        console.log(tmt);
        res.json({is_updated: true});
    }

    static async delete(req, res) {
        var tmt = req.body.tmt;
        console.log(tmt);
        res.json({is_deleted: true});
    }

    static async insert(req, res) {
        var tmt = req.body.tmt;
        console.log(tmt);
        res.json({is_inserted: true});
    }

}

export { TMTController };
