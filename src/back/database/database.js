import mysql from "mysql2/promise";

class database {
    static host = "localhost";
    static port = 3306;
    static user = "root";
    static password = "root";
    static database = "serious_game";

    static set_parameters(host, port, user, password, database) {
        this.host = host;
        this.user = user;
        this.port = port;
        this.password = password;
        this.database = database;
    }

    static async connect() {
        var connection = await mysql.createConnection({
            host: database.host,
            port: database.port,
            user: database.user,
            password: database.password,
            database: database.database
        });
        return connection;
    }

    static async disconnect(connection) {
        await connection.end();
    }

    static async query(query) {
        var connection = await database.connect();
        try {
        var [rows, fields] = await connection.execute(query);
        } catch(e) {
            console.log('+++++++++++++++++++++++++++++++++++++');
            console.log(e);
            console.log('+++++++++++++++++++++++++++++++++++++');
        }
        await database.disconnect(connection);
        return [rows, fields];
    }   
}

export { database };