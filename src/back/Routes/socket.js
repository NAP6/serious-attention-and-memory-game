import { MatchCrontroller } from "../controller/MatchController.js";

export function init_socket_chanels(server) {
  if (!server || !server.socket) {
    console.log("ERROR TO CONECT SOCKET");
    return;
  }
  const io = server.socket;

  io.on("connection", (socket) => {
    socket.on("match/save_ET_point", (data) => {
      MatchCrontroller.save_ET_point(data.match_id, data.point);
      console.log("eye");
    });

    socket.on("match/save_event", (data) => {
      MatchCrontroller.save_event(data.match, data.event);
      console.log("event");
    });
  });
}
