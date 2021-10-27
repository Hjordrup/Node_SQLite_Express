const express = require('express');
const app = express();
const db = require('./database.js');
const PORT = 8080;

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



app.use(function (req, res) {
    res.status(404);
});