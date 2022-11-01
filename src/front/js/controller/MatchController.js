import { Match } from "../../../Match.js";
import { post_api } from "../helper_models/post_api.js";
var socket = io();

class MatchCrontroller {
  static async get_by_patient(patient_id) {
    var data = { patient_id: patient_id };
    var res = await post_api(
      `${window.location.origin}/api/match/get_by_patient`,
      data
    );
    res = res.map((m) => {
      return MatchCrontroller.toClass(m);
    });
    return res;
  }

  static async update(match) {
    var data = { match: match };
    var res = await post_api(
      `${window.location.origin}/api/match/update`,
      data
    );
    return res.is_updated;
  }

  static async update_body(match) {
    var data = { match: match, user_id: localStorage.getItem("user_id") };
    var res = await post_api(
      `${window.location.origin}/api/match/update_body`,
      data
    );
    return res.is_updated;
  }

  static async create_header(match) {
    var data = { match: match, user_id: localStorage.getItem("user_id") };
    var res = await post_api(
      `${window.location.origin}/api/match/create_header`,
      data
    );
    return MatchCrontroller.toClass(res);
  }

  static async save_event(match, event) {
    var data = { match_id: match.id, event: event };
    // post_api(`${window.location.origin}/api/match/save_event`, data);
    try {
      socket.emit("match/save_event", data);
    } catch (e) {
      console.log("Error en Eventos: ", e);
    }
    return true;
  }

  static async save_ET_point(match, point) {
    var data = { match_id: match.id, point: point };
    // post_api(`${window.location.origin}/api/match/save_ET_point`, data);
    try {
      socket.emit("match/save_ET_point", data);
    } catch (e) {
      console.log("Error en Ojos: ", e);
    }
    return true;
  }

  static toClass(obj) {
    var match = new Match(
      obj.id,
      obj.game,
      obj.group,
      obj.date,
      obj.game_time,
      obj.score,
      obj.adjusted_score
    );
    return match;
  }
}

export { MatchCrontroller };
