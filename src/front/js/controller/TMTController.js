import { TMT, TMT_Game, TMT_Tutorial, TMTPoint } from "../../../TMT.js";
import { Group } from "../../../Group.js";
import { GroupController } from "./GroupContoller.js";
import { post_api } from "../helper_models/post_api.js";

class TMTController {
  static async getById(id) {
    var data = { id: id };
    var res = await post_api(`${window.location.origin}/api/tmt/getById`, data);
    res = await TMTController.toClass(res);
    return res;
  }

  static async getAll() {
    var data = {};
    var res = await post_api(`${window.location.origin}/api/tmt/getAll`, data);
    var tmts = [];
    for (var tmt of res) {
      var tmt_obj = await TMTController.toClass(tmt);
      tmts.push(tmt_obj);
    }
    return tmts;
  }

  static async update(tmt) {
    var data = { tmt: tmt };
    var res = await post_api(`${window.location.origin}/api/tmt/update`, data);
    return res.is_updated;
  }

  static async delete(tmt) {
    var data = { tmt: tmt };
    var res = await post_api(`${window.location.origin}/api/tmt/delete`, data);
    return res.is_deleted;
  }

  static async insert(tmt) {
    var data = { tmt: tmt };
    var res = await post_api(`${window.location.origin}/api/tmt/insert`, data);
    return res;
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
          level.tmt_tutorial?new TMT_Tutorial(
            level.tmt_tutorial.image?level.tmt_tutorial.image:"",
            toClassPoint(level.tmt_tutorial.points),
            level.tmt_tutorial.label_image?level.tmt_tutorial.label_image:"",
            level.tmt_tutorial.instructions?level.tmt_tutorial.instructions:""
          ):new TMT_Tutorial(),
          level.instructions
        );
        new_obj.levels.push(new_level);
      }
    return new_obj;
  }
}

export { TMTController };
