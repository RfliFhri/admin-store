const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  db.query(
    'SELECT p.*, s.quantity FROM products p JOIN stocks s ON p.id = s.product_id',
    (err, results) => {
      res.render('products', { 
        layout: "../views/layout/app.ejs",
        products: results,
       });
    }
  );
});

module.exports = router;
