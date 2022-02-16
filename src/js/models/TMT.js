import { Game } from "./Game.js";

class TMT extends Game {
    constructor(id, name, description, group, maximum_attempsts=1) {
        super(id, name, description, group, maximum_attempsts);
        this.levels = [];
    }

    add_level(image=null, points=[]) {
        var new_level = new TMTLevel(image, points);
        this.levels.push(new_level);
        return new_level;
    }

    remove_level(index) {
        this.levels.splice(index, 1);
    }

}

class TMTLevel {
    constructor(image=null, points=null, label_image=null) {
        if(image)
            this.image = image;
        else
            this.image = "";
        if(points)
            this.points = points;
        else
            this.points = [];
        if(label_image)
            this.label_image = label_image;
        else
            this.label_image = "";
    }
}

class TMTPoint {
    constructor(diameter, p_left, p_top, ax_left, ax_top, ax_width, ax_heigth) {
        this.setPosition(diameter, p_left, p_top, ax_left, ax_top, ax_width, ax_heigth);
    }

    setPosition(diameter, p_left, p_top, ax_left, ax_top, ax_width, ax_heigth) {
        this.diameter = diameter;
        this.left = p_left;
        this.top = p_top;
        this.ax_left = ax_left;
        this.ax_top = ax_top;
        this.ax_width = ax_width;
        this.ax_heigth = ax_heigth;
    }

    get radio() {
        return this.diameter / 2;
    }

    recalculate_inner_position(new_ax_left, new_ax_top, new_axe_width, new_axe_heigth) {
        var d = (new_axe_width * this.diameter) / this.ax_width;
        var x = this.#recalculate_position(this.left + this.radio, this.ax_left, new_ax_left, this.ax_width, new_axe_width) - (d / 2);
        var y = this.#recalculate_position(this.top + this.radio, this.ax_top, new_ax_top, this.ax_heigth, new_axe_heigth) - (d / 2);
        return {x: x, y: y, diameter: d};
    }

    #recalculate_position(p, ax_old, ax_new, ax_old_size, ax_new_size) {
        var r = ax_new + ((ax_new_size * (p - ax_old)) / ax_old_size);
        return r;
    }
}

export { TMT, TMTPoint };
