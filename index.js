const express = require ('express');
const { data } = require("./members");
const { users } = require("./users");
const moment = require("moment");
const app = express ();

app.get('/', (req, res) => res.json ({
    status : "success",
    message : "This is home page",
})
);

app.get('/about', (req, res) => res.json ({
    status: "Success",
    message: "Response success",
    description: "Exerscise #3",
    date: moment(),
    data,
})
);

app.get('/users', (req, res) => res.json ({
    users,
})
);

app.listen (5000, () => {
    console.log('Server is running');
});