import { Match } from '../../../Match.js';
import { post_api } from '../helper_models/post_api.js';

class MatchCrontroller {
    static async get_by_patient(patient_id) {
        var data = {patient_id: patient_id};
        var res = await post_api(`${window.location.origin}/api/match/get_by_patient`, data);
        res = res.map((m) => { return MatchCrontroller.toClass(m); });
        return res;
    }

    static async update(match) {
        var data = {match: match};
        var res = await post_api(`${window.location.origin}/api/match/update`, data);
        return res.is_updated;
    }

    static async insert(match) {
        var data = {match: match};
        var res = await post_api(`${window.location.origin}/api/match/insert`, data);
        return res.is_iserted;
    }
 
    static toClass(obj) {
        var match = new Match(obj.id, obj.game, obj.group, obj.date, obj.game_time, obj.score, obj.adjusted_score);
        return match;
    }
}

export { MatchCrontroller };
