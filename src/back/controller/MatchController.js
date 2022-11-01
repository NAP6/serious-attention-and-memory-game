import { Match } from "../../models/Match.js";
import { database } from "../database/database.js";
import { GroupController } from "./GroupContoller.js";

class MatchCrontroller {
  static async get_by_patient(req, res) {
    var patient_id = req.body.patient_id;

    var sql = `call get_match_by_patient(${patient_id})`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].matchs) res.json([]);
    else {
      var matchs = [];
      for (let match of rows[0][0].matchs) {
        matchs.push(await MatchCrontroller.toClass(match));
      }
      res.json(matchs);
    }
  }

  static async update(req, res) {
    var match = req.body.match;

    var sql = `call update_adjusted_score_of_match(${match.id}, ${match.adjusted_score})`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].is_updated)
      res.json({ is_updated: false });
    else res.json({ is_updated: rows[0][0].is_updated });
  }

  static async update_body(req, res) {
    if (
      req &&
      req.session &&
      req.session.active_user &&
      req.session.active_user.id
    )
      var patient_id = req.session.active_user.id;
    else patient_id = req.body.user_id;
    var match = req.body.match;
    var sql = `call update_match(${patient_id}, '${JSON.stringify(
      match
    ).replace(/'/g, "\\'")}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].is_updated)
      res.json({ is_updated: false });
    else res.json({ is_updated: rows[0][0].is_updated });
  }

  static async create_header(req, res) {
    if (
      req &&
      req.session &&
      req.session.active_user &&
      req.session.active_user.id
    )
      var patient_id = req.session.active_user.id;
    else patient_id = req.body.user_id;
    var match = req.body.match;
    let sql = `call create_header_match(${patient_id}, '${JSON.stringify(
      match
    ).replace(/'/g, "\\'")}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].inserted_id)
      res.json({ is_inserted: false });
    else {
      match.id = rows[0][0].inserted_id;
      res.json(match);
    }
  }

  static async save_event(match, event) {
    var sql = `call insert_match_event('${JSON.stringify(event).replace(
      /'/g,
      "\\'"
    )}', '${JSON.stringify(match).replace(/'/g, "\\'")}')`;
    database.query(sql);
  }

  static async save_event_r(req, res) {
    var match = req.body.match;
    var event = req.body.event;
    MatchCrontroller.save_event(match, event);
    res.json({ is_saved: true });
  }

  static async save_ET_point(match_id, point) {
    var sql = `call insert_eye_focus_point(${match_id}, '${JSON.stringify(
      point
    ).replace(/'/g, "\\'")}')`;
    database.query(sql);
  }

  static async save_ET_point_r(req, res) {
    var match_id = req.body.match_id;
    var point = req.body.point;
    MatchCrontroller.save_ET_point(match_id, point);
    res.json({ is_saved: true });
  }

  static async toClass(match) {
    match.group = await GroupController.getById(match.game.group);
    return match;
  }
}

export { MatchCrontroller };
