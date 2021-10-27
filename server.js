const express = require('express');
const app = express();
const db = require('./database.js');
const md5 = require('md5');
const bodyParser = require('body-parser');
const PORT = 8080;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" });
});

app.get('/api/users', (req, res, next) => {
    const getAllUsers = 'select * from user';
    let params = [];
    db.all(getAllUsers, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        res.json({
            "message": "success",
            "data": rows,
        })
    });
});


app.get('/api/user/:id', (req, res, next) => {
    const getASingleUser = "select * from user where id = ?"
    let params = [req.params.id];
    db.get(getASingleUser, params, (err, row) => {
        if (err) {
            res.status(400).json({ "message": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row,
        });
    })
});


app.post("/api/user/", (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }
    var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params = [data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

app.patch('/api/user/:id', (req, res, next) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ?
            md5(req.body.password) : null,
    }
    db.run(
        `UPDATE user set 
    name = COALESCE(?,name),  
    email = COALESCE(?,email),
    password = COALESCE(?,password) 
    WHERE id = ?` ,
        [data.name, data.email, data.password, req.params.id], function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message });
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
});




app.use(function (req, res) {
    res.status(404);
});