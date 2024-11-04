const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configura o banco de dados SQLite
const db = new sqlite3.Database('./chat.db', (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
        // Cria a tabela de mensagens se não existir
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

app.use(express.static('public'));

// Quando um usuário se conecta, envia o histórico de mensagens
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');
    
    // Recupera o histórico de mensagens do banco de dados
    db.all("SELECT name, message, timestamp FROM messages ORDER BY timestamp ASC", (err, rows) => {
        if (err) {
            console.error("Erro ao recuperar o histórico de mensagens:", err.message);
        } else {
            // Envia o histórico para o usuário que acabou de se conectar
            socket.emit('chat history', rows);
        }
    });

    // Salva a nova mensagem e retransmite para todos os clientes
    socket.on('chat message', (data) => {
        // Insere a nova mensagem no banco de dados
        const { name, message } = data;
        db.run(`INSERT INTO messages (name, message) VALUES (?, ?)`, [name, message], (err) => {
            if (err) {
                console.error("Erro ao salvar a mensagem:", err.message);
            } else {
                // Envia a mensagem para todos os usuários conectados
                io.emit('chat message', data);
            }
        });
    });
    
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
