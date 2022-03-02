import express from "express";
import session from "express-session";
import body_parser from "body-parser";
import morgan from "morgan";

class Server {
    constructor(port, statics_route, routes) {
        this.app = express();

        for(let sr of statics_route)
            this.app.use(express.static(sr));
        this.app.use(morgan('dev'));
        this.app.use(session({
          secret: 'keyboard cat',
          resave: false,
          saveUninitialized: true
        }));
        this.app.use(body_parser.json({limit: '50mb'}));
        this.app.use(body_parser.urlencoded({extended: false}));

        for(let r of routes)
            this.app.use(r);

        this.port = port;
    }

    start() {
        this.app.listen(this.port, (err)=>{
            if (err) console.log(err);
                console.log("Server listening on PORT", this.port);
        });
    }
}

export { Server };
