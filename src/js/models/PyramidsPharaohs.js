import { Game } from "./Game.js";

class PyramidsPharaohs extends Game {
    constructor(id, name, description) {
        super(id, name, description);
        this.levels = [];
    }

    add_lavel(example=[], answer=[], answer_selected=[]) {
        var lavel = new Level();
        lavel.example = example;
        lavel.answer = answer;
        lavel.answer_selected = answer_selected;
        this.levels.push(lavel);
    }

    remove_lavel(index) {
        this.levels.splice(index, 1);
    }

}

class Level {
    example = [];
    answer = [];
    answer_selected = [];

    example_remove(index) {
        this.example.splice(index, 1);
    }

    answer_remove(index) {
        this.answer.splice(index, 1);
    }

    selection_remove(index) {
        this.answer_selected.splice(index, 1);
    }
}

export { PyramidsPharaohs };
