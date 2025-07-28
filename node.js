// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexão com SQLite
const db = new sqlite3.Database('./produtos.db');

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    descricao TEXT
)`);

// GET /produtos
app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM produtos', (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// POST /produtos
app.post('/produtos', (req, res) => {
    const { nome, preco, descricao } = req.body;
    db.run('INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)', 
        [nome, preco, descricao], function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ id: this.lastID, nome, preco, descricao });
    });
});

// DELETE /produtos/:id
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM produtos WHERE id = ?', id, function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ deletado: this.changes > 0 });
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));