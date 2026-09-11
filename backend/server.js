const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt'); 

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'pslid_auldatabase',
  password: '#punyaAul', // Sesuaikan password MAMP kamu
  database: 'pslid_it_asset_db',
  port: 3306,       // Sesuaikan port MAMP kamu
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root', // Sesuaikan password MAMP kamu
//   database: 'it_asset_db',
//   port: 3306,       // Sesuaikan port MAMP kamu
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

db.getConnection((err, connection) => {
  if (err) {
    console.error('Gagal terkoneksi ke database MySQL:', err);
    return;
  }
  console.log('Berhasil terkoneksi ke Database MySQL (Pool Mode)!');
  connection.release();
});

// 1. ENDPOINT: Login Sederhana (POST)
// <-- Pastikan bcrypt sudah di-require di atas

// Endpoint Register Akun Baru
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi!' });
  }

  try {
    // Hash password sebelum disimpan ke database (aman dari kebocoran data)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    // Default role untuk user yang register sendiri adalah 'user'
    db.query(query, [username, email, hashedPassword, 'user'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ success: false, message: 'Username atau Email sudah terdaftar!' });
        }
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint Login dengan Verifikasi Hash Password
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const user = results[0];

      // Bandingkan password input dengan password hash di database
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ 
          success: true, 
          role: user.role || 'user',
          username: user.username
        });
      } else {
        res.status(401).json({ success: false, message: 'Username atau password salah' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  });
});

// 2. ENDPOINT: Ambil Semua Data Aset (GET)
app.get('/api/assets', (req, res) => {
  const query = 'SELECT * FROM assets ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. ENDPOINT: Tambah Aset Baru (POST)
app.post('/api/assets', (req, res) => {
  const { name, ram, storage, sn, charger, status, holder, description, updatedAt } = req.body;
  const query = `INSERT INTO assets (name, ram, storage, sn, charger, status, holder, description, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [name, ram, storage, sn, charger, status, holder, description, updatedAt], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset berhasil ditambahkan!', id: results.insertId });
  });
});

// 4. ENDPOINT: Update/Edit Aset (PUT)
app.put('/api/assets/:id', (req, res) => {
  const { id } = req.params;
  const { name, ram, storage, sn, charger, status, holder, description, updatedAt } = req.body;
  const query = `UPDATE assets SET name=?, ram=?, storage=?, sn=?, charger=?, status=?, holder=?, description=?, updatedAt=? WHERE id=?`;
  
  db.query(query, [name, ram, storage, sn, charger, status, holder, description, updatedAt, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset berhasil diupdate!' });
  });
});

// 5. ENDPOINT: Hapus Aset (DELETE)
app.delete('/api/assets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM assets WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset berhasil dihapus!' });
  });
});

// --- ENDPOINT ASET DIGITAL ---

// Ambil semua aset digital
app.get('/api/digital-assets', (req, res) => {
  const query = 'SELECT * FROM digital_assets ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Tambah aset digital
app.post('/api/digital-assets', (req, res) => {
  const { platform, username, password, department, pic, description, updatedAt } = req.body;
  const query = `INSERT INTO digital_assets (platform, username, password, department, pic, description, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [platform, username, password, department, pic, description, updatedAt], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset digital berhasil ditambahkan!', id: results.insertId });
  });
});

// Update aset digital
app.put('/api/digital-assets/:id', (req, res) => {
  const { id } = req.params;
  const { platform, username, password, department, pic, description, updatedAt } = req.body;
  const query = `UPDATE digital_assets SET platform=?, username=?, password=?, department=?, pic=?, description=?, updatedAt=? WHERE id=?`;
  
  db.query(query, [platform, username, password, department, pic, description, updatedAt, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset digital berhasil diupdate!' });
  });
});

// Hapus aset digital
app.delete('/api/digital-assets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM digital_assets WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aset digital berhasil dihapus!' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server backend jalan di http://localhost:${PORT}`);
});