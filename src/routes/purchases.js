const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  db.query(
    `SELECT pu.*, pr.name 
     FROM purchases pu 
     JOIN products pr ON pu.product_id = pr.id`,
    (err, purchases) => {
      if (err) return res.send(err);

      db.query(
        'SELECT * FROM products',
        (err, products) => {
          if (err) return res.send(err);

        res.render('purchases', { 
          layout: "../views/layout/app.ejs",
          purchases,
          products,
         });
      })
    }
  );
});

router.post('/add', (req, res) => {
  const { product_id, quantity } = req.body;

  db.query(
    'SELECT price, quantity FROM stocks JOIN products ON stocks.product_id = products.id WHERE product_id=?',
    [product_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Produk tidak ditemukan"
        });
      }

      if (result[0].quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Stock tidak cukup"
        });
      }

      const total = result[0].price * quantity;

      db.query(
        'INSERT INTO purchases (product_id, quantity, total_price) VALUES (?,?,?)',
        [product_id, quantity, total]
      );

      db.query(
        'UPDATE stocks SET quantity = quantity - ? WHERE product_id = ?',
        [quantity, product_id]
      );

      res.status(200).json({
        success: true,
        message: "Pembelian berhasil ditambahkan"
      });
    }
  );
});

router.post('/cancel/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT product_id, quantity FROM purchases WHERE id=? AND status="ACTIVE"',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err
        });
      }

      if (!result.length) {
        return res.status(400).json({
          success: false,
          message: "Pembelian tidak valid atau sudah dibatalkan"
        });
      } 

      db.query(
        'UPDATE stocks SET quantity = quantity + ? WHERE product_id = ?',
        [result[0].quantity, result[0].product_id]
      );

      db.query(
        'UPDATE purchases SET status="CANCELLED" WHERE id=?',
        [id]
      );

      res.status(200).json({
        success: true,
        message: "Pembelian berhasil dibatalkan"
      });
    }
  );
});

router.post('/delete/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT status FROM purchases WHERE id=?',
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err
        });
      }

      if (!result.length) {
        return res.status(400).json({
          success: false,
          message: "Data tidak ditemukan"
        });
      }

      if(result[0].status !== "CANCELLED" ) {
        return res.status(400).json({
          success: false,
          message: "Hanya pembelian yang status CANCELLED yang bisa dihapus"
        });
      }

      db.query(
        'DELETE FROM purchases WHERE id=?',
        [id],
        (err) => {

         if (err) {
          return res.status(500).json({
            success: false,
            message: "Server error"
          });
         }
         
         res.status(200).json({
          success: true,
          message: "Hapus pembelian telah berhasil"
         });
        }
      );

    }
  );
});

module.exports = router;
