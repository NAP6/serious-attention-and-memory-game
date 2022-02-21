import { Match } from '../../models/Match.js';

class MatchCrontroller {
    static get_by_patient(patient_id) {
        var list_matchs = [];
        for(var i = 0; i < 5; i++) {
            list_matchs.push(new Match(i, ['Piramides y Faraones', 'TMT'][(Math.random()>=0.5)? 1 : 0], `Grupo ${Math.floor(Math.random() * 11)}`, null, Math.random() * 100, 100, null));
        }
        return list_matchs;
    }

    static aux_alertar = false;
    static update(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static insert(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }
}

export { MatchCrontroller };
