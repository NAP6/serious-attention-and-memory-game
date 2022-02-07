import { Game } from "./Game.js";

class PyramidsPharaohs extends Game {
    constructor(id, name, description) {
        super(id, name, description);
        this.levels = [];
    }

    add_level(example=[], answer=[], answer_selected=[]) {
        var lavel = new PPLevel();
        lavel.example = example;
        lavel.answer = answer;
        for(let i of answer_selected) {
            lavel.answer.get(i).selected = true;
        }
        this.levels.push(lavel);
        return lavel;
    }

    remove_level(index) {
        this.levels.splice(index, 1);
    }

}

class PPLevel {

    pp_example = [];
    pp_answer = [];


    get example() {
        return {
            push: (image, selected=false)=> {
                if(image instanceof PPImage) {
                    this.pp_example.push(image);
                    return image;
                } else {
                    var ppImage = new PPImage(image, selected);
                    this.pp_example.push(ppImage);
                    return ppImage;
                }
            },
            get: (index)=> {
                return this.pp_example[index];
            },
            indexOf: (ppImage)=> {
                return this.pp_example.indexOf(ppImage);
            },
            remove: (index)=> {
                this.pp_example.splice(index, 1);
            },
            length: this.pp_example.length
        }
    }

    set example(list) {
        for(let e of list){
            if(e instanceof PPImage) {
                this.pp_example.push(e);
            } else {
                this.pp_example.push(new PPImage(e));
            }
        }
    }

    get answer() {
        return {
            push: (image, selected=false)=> {
                if(image instanceof PPImage) {
                    this.pp_answer.push(image);
                    return image;
                } else {
                    var ppImage = new PPImage(image, selected);
                    this.pp_answer.push(ppImage);
                    return ppImage;
                }
            },
            get: (index)=> {
                return this.pp_answer[index];
            },
            indexOf: (ppImage)=> {
                return this.pp_answer.indexOf(ppImage);
            },
            remove: (index)=> {
                this.pp_answer.splice(index, 1);
            },
            length: this.pp_answer.length
        }
    }

    set answer(list) {
        for(let e of list){
            if(e instanceof PPImage) {
                this.pp_answer.push(e);
            } else {
                this.pp_answer.push(new PPImage(e));
            }
        }
    }

}

class PPImage {
    constructor(image, selected=false){
        this.image = image;
        this.selected = selected;
    }
}

export { PyramidsPharaohs, PPLevel, PPImage };
