import { Match } from '../../models/Match.js';
import { database } from "../database/database.js";
import { GroupController } from './GroupContoller.js';

class MatchCrontroller {
    static async get_by_patient(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);

        var sql = `call get_match_by_patient(${patient_id})`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0] || !rows[0][0].matchs) res.json([]);
        else {
            var matchs = [];
            for(let match of rows[0][0].matchs) {
                matchs.push(await MatchCrontroller.toClass(match));
            }
            console.log(matchs);
            res.json(matchs);
        }
    }

    static async update(req, res) {
        var match = req.body.match;
        console.log(match);

        var sql = `call update_adjusted_score_of_match(${match.id}, ${match.adjusted_score})`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        console.log(rows);
        if(!rows || !rows[0] || !rows[0][0] || !rows[0][0].is_updated) res.json({is_updated: false});
        else res.json({is_updated: rows[0][0].is_updated});
    }

    static async insert(req, res) {
        var patient_id = req.session.active_user.id;
        var match = req.body.match;
        console.log(match);
        var sql = `call insert_match(${patient_id}, '${JSON.stringify(match)}')`;
        console.log(sql);
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0] || !rows[0][0].is_inserted) res.json({is_inserted: false});
        else res.json({is_inserted: rows[0][0].is_inserted});
    }

    static async toClass(match) {
        match.group = await GroupController.getById(match.game.group);
        console.log(match);
        return match;
    }
}

export { MatchCrontroller };
