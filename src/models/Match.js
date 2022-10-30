class Match {
  constructor(
    id,
    game,
    group,
    date = null,
    game_time = null,
    score = null,
    adjusted_score = null
  ) {
    this.id = id;
    this.game = game;
    this.group = group;
    if (!date) {
      var cdate = new Date();
      date = `${cdate.getDate()}/${cdate.getMonth() + 1}/${cdate.getFullYear()} ${cdate.getHours()}`;
    }
    this.date = date;
    this.game_time = game_time;
    this.score = score;
    this.adjusted_score = adjusted_score;
    this.game_cronometer = new MatchCronometer();
    this.levels_cronometers = {};
    this.events = [];
    this.eye_traking = [];
    this.eye_tracker_precision_estimate = null;
  }

  start() {
    this.game_cronometer.startCronometer();
  }

  finish() {
    this.game_cronometer.finishCronometer();
    this.game_time = this.game_cronometer.total_time;
    this.score = this.#calculate_score();
  }

  start_level(level_id) {
    this.levels_cronometers[level_id] = new MatchCronometer();
    this.levels_cronometers[level_id].startCronometer();
  }

  finish_level(level_id) {
    this.levels_cronometers[level_id].finishCronometer();
  }

  #calculate_score() {
    return  100;
  }

  register_event(
    level_id,
    item_tag,
    item_index,
    element_top,
    element_left,
    element_width,
    element_height,
    vewport_width,
    vewport_height,
    is_correct,
    x_eye_position,
    y_eye_position,
    is_for_save = false
  ) {
    var event = new MatchEvent(
      level_id,
      item_tag,
      item_index,
      element_top,
      element_left,
      element_width,
      element_height,
      vewport_width,
      vewport_height,
      is_correct,
      x_eye_position,
      y_eye_position
    );
    if (is_for_save) this.events.push(event);
    return event;
  }

  register_eye_position(x, y, is_for_save = false) {
    const point = new eye_focus_point(x, y);
    if (is_for_save) this.eye_traking.push(point);
    return point;
  }
}

class MatchCronometer {
  constructor() {
    this.start = null;
    this.finish = null;
    this.total_time = null;
  }

  startCronometer() {
    this.start = new Date().getTime();
  }

  finishCronometer() {
    this.finish = new Date().getTime();
    this.total_time = this.finish - this.start;
  }
}

class MatchEvent {
  constructor(
    level_id,
    item_tag,
    item_index,
    element_top,
    element_left,
    element_width,
    element_height,
    vewport_width,
    vewport_height,
    is_correct,
    x_eye_position,
    y_eye_position
  ) {
    this.time = new Date().getTime();
    this.level_id = level_id;
    this.item_tag = item_tag;
    this.item_index = item_index;
    this.element_top = element_top;
    this.element_left = element_left;
    this.element_width = element_width;
    this.element_height = element_height;
    this.vewport_width = vewport_width;
    this.vewport_height = vewport_height;
    this.is_correct = is_correct;
    this.eye_position = new eye_focus_point(x_eye_position, y_eye_position);
  }
}

class eye_focus_point {
  constructor(x, y) {
    this.time = new Date().getTime();
    this.x = x;
    this.y = y;
  }
}

export { Match };
