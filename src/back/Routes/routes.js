import express from "express";

function Router(__dir_front) {
    var router = express.Router();

    router.get('/',(req,res)=> {
        res.sendfile(__dir_front + '/home.html');
    });

    router.get('/admin',(req,res)=> {
        res.sendfile(__dir_front + '/admin_portal/dashboard.html');
    });

    return router;
}



export { Router };
