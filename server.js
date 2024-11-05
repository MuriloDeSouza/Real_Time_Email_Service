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

const ADMIN_PASSWORD = 'apagar123';

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// });

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
        const { name, message} = data;
        //aqui no timestamp eu to utilizando para plotar as mensagens com a data e horário
        db.run(`INSERT INTO messages (name, message) VALUES (?, ?)`, [name, message], (err) => {
            if (err) {
                console.error("Erro ao salvar a mensagem:", err.message);
            } else {
                // Recupera a última mensagem inserida para incluir o timestamp ao emití-la
                db.get("SELECT name, message, timestamp FROM messages ORDER BY id DESC LIMIT 1", (err, row) => {
                    if (err) {
                        console.error("Erro ao recuperar a última mensagem:", err.message);
                    } else {
                        io.emit('chat message', row);
                    }
                });
            }
        });
    });

    //limpar o histórico de mensagens com o botão
    socket.on('clear history', (password, calback) => {
        if(password === ADMIN_PASSWORD){
            db.run(`DELETE FROM messages`, (err) => {
                if (err) {
                    console.error("Erro ao limpar o histórico de mensagens:", err.message);
                    calback(false);
                } else {
                    // Envia a mensagem para todos os usuários conectados
                    console.log('Histórico de mensagens apagado');
                    io.emit('chat clear');
                    calback(true);
                }
            });
        }else{
            calback(false); // senha incorreta vai tentar novamente
        }
    });
        
    
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`);
// });

// server.listen(3000, () => {
//     console.log('Servidor rodando em http://localhost:3000');
// });

server.listen(9001, () => {
    console.log('Servidor rodando em https://real-time-msg-service.vercel.app');
});