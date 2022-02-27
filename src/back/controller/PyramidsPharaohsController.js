import { PyramidsPharaohs } from '../../models/PyramidsPharaohs.js';
import { Group } from '../../models/Group.js';
import { GroupController } from './GroupContoller.js';
import { database } from "../database/database.js";
import { save_image } from "../save_image.js";

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

class PyramidsPharaohsController {

    static async getById(id) {
        var sql = `call get_pdp('${id}')`;
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0]) return {};
        else{
            var pdp = rows[0][0].pdp;
            return await TMTController.toClass(pdp);
        }
    }

    static async getById_external(req, res) {
        var id = req.body.id;
        console.log(id);
        var pdp = await PyramidsPharaohsController.getById(id);
        res.json(pdp);
    }

    static async getAll(req, res) {
        var admin_id = req.session.active_user.id;
        var sql = `call bring_pdps_from_an_administrator('${admin_id}')`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(
            !rows || 
            !rows[0] || 
            !rows[0][0] || 
            !rows[0][0].pdps
        ) res.json([]);
        else{
            console.log(rows[0]);
            var pdps = rows[0][0].pdps;
            res.json(pdps);
        }
    }

    static async update(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        if(pdp.levels.length > 0) {
            for(var i=0; i < pdp.levels.length; i++) {
                //example
                for(var j=0; j < pdp.levels[i].pp_example.length; j++) {
                    var image_example = pdp.levels[i].pp_example[j];
                    if(image_example.image && image_example.image.startsWith('data:image')) {
                        var decodeBase64 = save_image.decodeBase64(image_example.image);
                        var path = `/img/pdp_${pdp.id}_${i}_example_${j}.${decodeBase64.type.split('/').pop()}`;
                        save_image.save(join(__dirname, `../../front/assets${path}`), decodeBase64.data);
                        pdp.levels[i].pp_example[j].image = path;
                    }
                }
                //answer
                for(var j=0; j < pdp.levels[i].pp_answer.length; j++) {
                    var image_answer = pdp.levels[i].pp_answer[j];
                    if(image_answer.image && image_answer.image.startsWith('data:image')) {
                        var decodeBase64 = save_image.decodeBase64(image_answer.image);
                        var path = `/img/pdp_${pdp.id}_${i}_answer_${j}.${decodeBase64.type.split('/').pop()}`;
                        save_image.save(join(__dirname, `../../front/assets${path}`), decodeBase64.data);
                        pdp.levels[i].pp_answer[j].image = path;
                    }
                }
            }
        }
        var sql = `call update_pdp('${JSON.stringify(pdp)}')`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0]) res.json({is_updated: false});
        else{
            res.json({is_updated: rows[0][0].is_updated});
        }
    }

    static async delete(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        var sql = `call delete_game('${pdp.id}')`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0]) res.json({is_deleted: false});
        else{
            res.json({is_deleted: rows[0][0].is_deleted});
        }
    }

    static async insert(req, res) {
        var pdp = req.body.pdp;
        console.log(pdp);
        var sql = `call insert_game('${JSON.stringify(pdp)}', 'pdp')`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(rows && rows[0] && rows[0][0]) {
            var inserted_id = rows[0][0].inserted_id;
            res.json({is_inserted: inserted_id? true: false, inserted_id: inserted_id});
        } else {
            res.json({is_inserted: false});
        }
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
