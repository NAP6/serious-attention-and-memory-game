import { Match } from '../../models/Match.js';

class MatchCrontroller {
    static async get_by_patient(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);
        var list_matchs = [];
        for(var i = 0; i < 5; i++) {
            list_matchs.push(new Match(i, ['Piramides y Faraones', 'TMT'][(Math.random()>=0.5)? 1 : 0], `Grupo ${Math.floor(Math.random() * 11)}`, null, Math.random() * 100, 100, null));
        }
        res.json(list_matchs);
    }

    static async update(req, res) {
        var match = req.body.match;
        console.log(match);
        res.json({is_updated: true});
    }

    static async insert(req, res) {
        var match = req.body.match;
        console.log(match);
        res.json({is_inserted: true});
    }
}

export { MatchCrontroller };
