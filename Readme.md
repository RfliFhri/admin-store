# Admin Store

Project ini adalah sistem admin sederhana untuk mengelola pembelian produk

## 🧠 Features
- Add / View Products
- Stock tracking
- Admin Purchase, Cancel, Delete

## 🧱 Tech Stack
Node.js • Express • EJS • MySQL 

## 📂 Struktur Folder
```stuktur
admin-purchase/
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── purchases.js
│   │   └── chatbot.js
│   └── app.js
│
├── views/
│   ├── layout.ejs
│   ├── products.ejs
│   ├── purchases.ejs
│   └── chat.ejs
│
├── public/
│   └── style.css
│
├── .env
├── package.json
└── README.md
```
## 🗄️ Database
Create tables:

```sql
CREATE DATABASE admin_store;
USE admin_store;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2)
);

CREATE TABLE stocks (
  product_id INT PRIMARY KEY,
  quantity INT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  quantity INT,
  total_price DECIMAL(10,2),
  status ENUM('ACTIVE','CANCELLED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

```

### Tambahkan data dummy
```sql
INSERT INTO products (name, price) VALUES
('Pensil',2000),('Pulpen',3000),('Buku',5000),('Penghapus',1500),
('Penggaris',4000),('Spidol',7000),('Kertas A4',35000),
('Map',2500),('Stabilo',6000),('Notebook',15000);

INSERT INTO stocks (product_id, quantity)
SELECT id, 100 FROM products;
```

## ⚙️ Instalasi & Setup

### 1️⃣ Clone Repository
```bash
  git clone https://github.com/RfliFhri/admin-store.git
  cd admin-store
  npm install
  npm run dev
```

### ▶️ Akses:

 - Admin Purchases → http://localhost:3000/purchases

 - Produk → http://localhost:3000/products

## 👤 Author

> Rafli
> Mahasiswa / Web Developer
