import express from "express";
import session from "express-session";
import body_parser from "body-parser";
import morgan from "morgan";

class Server {
    constructor(port, statics_route, routes) {
        this.app = express();

        for(let sr of statics_route)
            this.app.use(express.static(sr));
        this.app.use(morgan('common'));
        this.app.use(session({
          secret: 'keyboard cat',
          resave: false,
          saveUninitialized: true
        }));
        this.app.use(body_parser.json({limit: "500mb"}));
        this.app.use(body_parser.urlencoded({extended: false}));

        //Juancho solucin
        // this.app.use(function(req, res) {
        //     res.setHeader('Content-Type', 'text/plain');
        //     res.write('you posted:\n');
        //     res.end(JSON.stringify(req.body, null, 2));
        // });

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
