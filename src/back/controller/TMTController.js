import { TMT, TMTLevel, TMTPoint, TMT_Game, TMT_Tutorial } from "../../models/TMT.js";
import { Group } from "../../models/Group.js";
import { GroupController } from "./GroupContoller.js";
import { database } from "../database/database.js";
import { save_image } from "../save_image.js";

import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

class TMTController {
  static async getById(id) {
    var sql = `call get_tmt('${id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) return {};
    else {
      var tmt = rows[0][0].tmt;
      return await TMTController.toClass(tmt);
    }
  }

  static async getById_external(req, res) {
    var id = req.body.id;
    var tmt = await TMTController.getById(id);
    res.json(tmt);
  }

  static async toClass(obj) {
    var group;
    if (typeof obj.group == "object") {
      group = await GroupController.toClass(obj.group);
    } else {
      var group = await GroupController.getById(obj.group);
    }
    var new_obj = new TMT(
      obj.id,
      obj.name,
      obj.description,
      group,
      obj.maximum_attempsts
    );
    function toClassPoint(points) {
      var new_points = [];
      if (points && points.length > 0)
        for (let point of points) {
          var new_point = new TMTPoint(
            point.diameter,
            point.left,
            point.top,
            point.ax_left,
            point.ax_top,
            point.ax_width,
            point.ax_heigth
          );
          new_points.push(new_point);
        }
      return new_points;
    }
    if (obj.levels && obj.levels.length > 0)
      for (let level of obj.levels) {
        var new_level = new TMT_Game(
          level.image,
          toClassPoint(level.points),
          level.label_image,
          level.tmt_tutorial
            ? new TMT_Tutorial(
                level.tmt_tutorial.image ? level.tmt_tutorial.image : "",
                toClassPoint(level.tmt_tutorial.points),
                level.tmt_tutorial.label_image
                  ? level.tmt_tutorial.label_image
                  : "",
                level.tmt_tutorial.instructions
                  ? level.tmt_tutorial.instructions
                  : ""
              )
            : new TMT_Tutorial(),
          level.instructions
        );
        new_obj.levels.push(new_level);
      }
    return new_obj;
  }

  static async getAll(req, res) {
    var admin_id = req.session.active_user.id;
    var sql = `call bring_tmts_from_an_administrator('${admin_id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].tmts) res.json([]);
    else {
      var tmts = rows[0][0].tmts;
      res.json(tmts);
    }
  }

  static async update(req, res) {
    var tmt = req.body.tmt;
    if (tmt.levels.length > 0) {
      for (var i = 0; i < tmt.levels.length; i++) {
        if (
          tmt.levels[i].image &&
          tmt.levels[i].image.startsWith("data:image")
        ) {
          var decodeBase64 = save_image.decodeBase64(tmt.levels[i].image);
          var path = `/img/tmt_${tmt.id}_${i}.${decodeBase64.type
            .split("/")
            .pop()}`;
          save_image.save(
            join(__dirname, `../../front/assets${path}`),
            decodeBase64.data
          );
          tmt.levels[i].image = path;
        }
        if (
          tmt.levels[i].tmt_tutorial.image &&
          tmt.levels[i].tmt_tutorial.image.startsWith("data:image")
        ) {
          var decodeBase64 = save_image.decodeBase64(
            tmt.levels[i].tmt_tutorial.image
          );
          var path = `/img/tmt_tutorial_${tmt.id}_${i}.${decodeBase64.type
            .split("/")
            .pop()}`;
          save_image.save(
            join(__dirname, `../../front/assets${path}`),
            decodeBase64.data
          );
          tmt.levels[i].tmt_tutorial.image = path;
        }
      }
    }
    var sql = `call update_tmt('${JSON.stringify(tmt).replace(/'/g, "\\'")}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) res.json({ is_updated: false });
    else {
      res.json({ is_updated: rows[0][0].is_updated });
    }
  }

  static async delete(req, res) {
    var tmt = req.body.tmt;
    var sql = `call delete_game('${tmt.id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) res.json({ is_deleted: false });
    else {
      res.json({ is_deleted: rows[0][0].is_deleted });
    }
  }

  static async insert(req, res) {
    var tmt = req.body.tmt;
    var sql = `call insert_game('${JSON.stringify(tmt).replace(
      /'/g,
      "\\'"
    )}', 'tmt')`;
    var [rows, fields] = await database.query(sql);
    if (rows && rows[0] && rows[0][0]) {
      var inserted_id = rows[0][0].inserted_id;
      res.json({
        is_inserted: inserted_id ? true : false,
        inserted_id: inserted_id,
      });
    } else {
      res.json({ is_inserted: false });
    }
  }
}

export { TMTController };
