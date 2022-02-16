class Match {
    constructor(id, game, group, date=null, game_time=null, score=null, adjusted_score=null) {
        this.id = id;
        this.game = game;
        this.group = group;
        if(!date) {
            var cdate = new Date();
            date = `${cdate.getDay()}/${cdate.getMonth()}/${cdate.getFullYear()}`;
        }
        this.date = date;
        this.game_time = game_time;
        this.score = score;
        this.adjusted_score = adjusted_score;
    }
}

export { Match };
