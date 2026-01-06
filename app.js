const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const productsRoute = require('./src/routes/products');
const purchasesRoute = require('./src/routes/purchases');
const path = require('path');
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/products', productsRoute);
app.use('/purchases', purchasesRoute);


app.get('/', (req, res) => {
  res.redirect('/purchases');
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})

