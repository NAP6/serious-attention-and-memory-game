import express from "express";
import session from "express-session";
import body_parser from "body-parser";
import morgan from "morgan";
import http from 'http';
import { Server as ServerIO } from 'socket.io';

class Server {
    static socket;
  constructor(port, statics_route, routes, socket=false) {
    this.app = express();

    if(socket){
        this.httpserver = http.createServer(this.app);
        this.socket = new ServerIO(this.httpserver);   
    }

    for (let sr of statics_route) this.app.use(express.static(sr));
    this.app.use(morgan("common"));
    this.app.use(
      session({
        secret: "Juegos Serios",
        resave: false,
        saveUninitialized: true,
      })
    );
    this.app.use(body_parser.json({ limit: "500mb" }));
    this.app.use(body_parser.urlencoded({ extended: false }));

    for (let r of routes) this.app.use(r);

    this.port = port;
  }

  start() {
    this.httpserver.listen(this.port, (err) => {
      if (err) console.log(err);
      console.log("Server listening on PORT", this.port);
    });
  }
}

export { Server };
