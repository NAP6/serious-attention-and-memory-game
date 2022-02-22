import { PyramidsPharaohs, PPLevel, PPImage } from '../../../PyramidsPharaohs.js';
import { Group } from '../../../Group.js';
import { GroupController } from './GroupContoller.js';
import { post_api } from '../helper_models/post_api.js';

class PyramidsPharaohsController {

    static async getById(id) {
        var data = {id: id};
        var res = await post_api(`${window.location.origin}/api/pdp/getById`, data);
        console.log(res);
        return res;
    }

    static async getAll() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/pdp/getAll`, data);
        var pdps = [];
        for(let pdp of res) {
            var new_pdp = await PyramidsPharaohsController.toClass(pdp);
            pdps.push(new_pdp);
        }
        console.log(pdps);
        return pdps;
    }

    static async update(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/update`, data);
        return res.is_updated;
    }

    static async delete(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/delete`, data);
        return res.is_deleted;
    }

    static async insert(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/insert`, data);
        return res.is_inserted;
    }

    static async toClass(pdp) {
        var group;
        if(typeof pdp.group === 'object') 
            group = await GroupController.toClass(pdp.group);
        else
            group = await GroupController.getById(pdp.group);
        var new_pdp = new PyramidsPharaohs(pdp.id, pdp.name, pdp.description, group, pdp.maximum_attempsts);
        if(pdp.levels && pdp.levels.length > 0) {
            for(let level of pdp.levels) {
                var new_level = new PPLevel();
                for(let example of level.pp_example) {
                    new_level.example.push(new PPImage(example.image, example.selected));
                }
                for(let answer of level.pp_answer) {
                    new_level.answer.push(new PPImage(answer.image, answer.selected));
                }
                new_pdp.levels.push(new_level);
            }
        }
        return new_pdp;
    }
}

export { PyramidsPharaohsController };
