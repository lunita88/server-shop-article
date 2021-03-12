require('dotenv-safe').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.options('*', cors());

app.use(express.static('uploads'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./routes/user.route.js")(app);
//require("./routes/order.route.js")(app);
require("./routes/article.route.js")(app);
require("./routes/customer.route.js")(app);

app.get('/', (req, res) => {
    res.send('Shop API test!');
});


app.listen(port, () => console.log(`Shop API app listening on port ${port}!`));