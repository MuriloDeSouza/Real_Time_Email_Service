document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('user-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const senha = document.getElementById('senha').value;

        const response = await fetch('/cadastrar_usuario/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, senha }),
        });

        if (response.ok) {
            window.location.href = "/chat.html";
        }
    });
});

// Configuração do WebSocket
const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat");
socket.onmessage = function(event) {
    const messages = document.getElementById('messages');
    const message = document.createElement('li');
    message.textContent = event.data;
    messages.appendChild(message);
};

document.getElementById('sendMessage').onclick = function() {
    const input = document.getElementById("messageText");
    socket.send(input.value);
    input.value = '';
};
