import {
  PyramidsPharaohs,
  PPLevel,
  PPImage,
} from "../../models/PyramidsPharaohs.js";
import { Group } from "../../models/Group.js";
import { GroupController } from "./GroupContoller.js";
import { database } from "../database/database.js";
import { save_image } from "../save_image.js";
import fs from "fs";

import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

class PyramidsPharaohsController {
  static async getById(id) {
    var sql = `call get_pdp('${id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) return {};
    else {
      var pdp = rows[0][0].pdp;
      pdp = await PyramidsPharaohsController.toClass(pdp);
      return PyramidsPharaohsController.transform_to_base64_pdp_images(pdp);
    }
  }

  static async getById_external(req, res) {
    var id = req.body.id;
    var pdp = await PyramidsPharaohsController.getById(id);
    res.json(pdp);
  }

  static async getAll(req, res) {
    var admin_id = req.session.active_user.id;
    var sql = `call bring_pdps_from_an_administrator('${admin_id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0] || !rows[0][0].pdps) res.json([]);
    else {
      var pdps = rows[0][0].pdps;
      pdps = await Promise.all(pdps.map(PyramidsPharaohsController.toClass));
      pdps = pdps.map(
        PyramidsPharaohsController.transform_to_base64_pdp_images
      );
      res.json(pdps);
    }
  }

  static async update(req, res) {
    var pdp = req.body.pdp;
    if (pdp.levels.length > 0) {
      for (var i = 0; i < pdp.levels.length; i++) {
        //example
        for (var j = 0; j < pdp.levels[i].pp_example.length; j++) {
          var image_example = pdp.levels[i].pp_example[j];
          if (
            image_example.image &&
            image_example.image.startsWith("data:image")
          ) {
            var decodeBase64 = save_image.decodeBase64(image_example.image);
            var path = `/img/pdp_${pdp.id}_${i}_example_${j}.${decodeBase64.type
              .split("/")
              .pop()}`;
            save_image.save(
              join(__dirname, `../../front/assets${path}`),
              decodeBase64.data
            );
            pdp.levels[i].pp_example[j].image = path;
          }
        }
        //answer
        for (var j = 0; j < pdp.levels[i].pp_answer.length; j++) {
          var image_answer = pdp.levels[i].pp_answer[j];
          if (
            image_answer.image &&
            image_answer.image.startsWith("data:image")
          ) {
            var decodeBase64 = save_image.decodeBase64(image_answer.image);
            var path = `/img/pdp_${pdp.id}_${i}_answer_${j}.${decodeBase64.type
              .split("/")
              .pop()}`;
            save_image.save(
              join(__dirname, `../../front/assets${path}`),
              decodeBase64.data
            );
            pdp.levels[i].pp_answer[j].image = path;
          }
        }
      }
    }
    var sql = `call update_pdp('${JSON.stringify(pdp).replace(/'/g, "\\'")}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) res.json({ is_updated: false });
    else {
      res.json({ is_updated: rows[0][0].is_updated });
    }
  }

  static async delete(req, res) {
    var pdp = req.body.pdp;
    var sql = `call delete_game('${pdp.id}')`;
    var [rows, fields] = await database.query(sql);
    if (!rows || !rows[0] || !rows[0][0]) res.json({ is_deleted: false });
    else {
      res.json({ is_deleted: rows[0][0].is_deleted });
    }
  }

  static async insert(req, res) {
    var pdp = req.body.pdp;
    var sql = `call insert_game('${JSON.stringify(pdp).replace(
      /'/g,
      "\\'"
    )}', 'pdp')`;
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

  static async toClass(pdp) {
    var group;
    if (typeof pdp.group === "object")
      group = await GroupController.toClass(pdp.group);
    else group = await GroupController.getById(pdp.group);
    var new_pdp = new PyramidsPharaohs(
      pdp.id,
      pdp.name,
      pdp.description,
      group,
      pdp.maximum_attempsts
    );
    if (pdp.levels && pdp.levels.length > 0) {
      for (let level of pdp.levels) {
        if (level) {
          var new_level = new PPLevel();
          if (level.pp_example && level.pp_example.length > 0) {
            for (let example of level.pp_example) {
              new_level.example.push(
                new PPImage(example.image, example.selected)
              );
            }
          }
          if (level.pp_answer && level.pp_answer.length > 0) {
            for (let answer of level.pp_answer) {
              new_level.answer.push(new PPImage(answer.image, answer.selected));
            }
          }
          new_pdp.levels.push(new_level);
        }
      }
    }
    return new_pdp;
  }

  static transform_to_base64_pdp_images(pdp) {
    if (pdp && pdp.levels) {
      pdp.levels = pdp.levels.map((level) => {
        const tranform_path_to_base64 = (ppImage) => {
          try {
            const img_path_parts = ppImage.image.split(".");
            const img_type = img_path_parts[img_path_parts.length - 1];
            ppImage.image =
              `data:image/${img_type};base64,` +
              fs.readFileSync(
                join(__dirname, `../../front/assets${ppImage.image}`),
                { encoding: "base64" }
              );
          } catch (e) {
            console.log("********************************************");
            console.log(e);
            console.log("********************************************");
          }
          return ppImage;
        };
        level.pp_example = level.pp_example.map(tranform_path_to_base64);
        level.pp_answer = level.pp_answer.map(tranform_path_to_base64);
        return level;
      });
    }
    return pdp;
  }
}

export { PyramidsPharaohsController };
