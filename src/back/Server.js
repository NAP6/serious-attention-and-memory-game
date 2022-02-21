import express from "express";
import session from "express-session";
import body_parser from "body-parser";
import morgan from "morgan";

class Server {
    constructor(port, static_route, routes, api) {
        this.app = express();

        this.app.use(express.static(static_route));
        this.app.use(morgan('dev'));
        this.app.use(session({
          secret: 'keyboard cat',
          resave: false,
          saveUninitialized: true
        }));
        this.app.use(body_parser.json());
        this.app.use(body_parser.urlencoded());

        this.app.use(routes);
        this.app.use(api);

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
