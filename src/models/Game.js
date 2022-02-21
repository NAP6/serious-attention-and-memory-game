class Game {

    constructor(id, name, description, group, maximum_attempsts=1) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.group = group;
        this.maximum_attempsts = maximum_attempsts;
    }

}

export { Game };
