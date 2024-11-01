# Chat em Tempo Real - Projeto de Estudo

&emsp; Um projeto de chat em tempo real utilizando Socket.IO e Express no backend e HTML/CSS/JavaScript para o frontend. Esse projeto foi desenvolvido para estudo e prática das tecnologias de backend e frontend, com integração em tempo real e persistência de dados usando SQLite. A aplicação é executada em containers Docker para facilitar o deploy e garantir consistência de ambiente.

# Link do vídeo da aplicação

Title: CHAT em tempo real com NodeJs e WebSockets

URL: [YouTube.com/](https://youtu.be/RisC86HOeFE)

&emsp; O objetivo deste projeto é criar uma aplicação de chat com funcionalidades de persistência de mensagens, onde cada usuário pode ver o histórico de conversas ao se reconectar. O sistema utiliza o Socket.IO para comunicação em tempo real entre clientes e o backend, e um banco de dados SQLite para armazenar o histórico das mensagens.
Tecnologias Usadas

# As principais tecnologias usadas neste projeto são:

- **Node.js (Express):** Framework backend utilizado para gerenciar as requisições e enviar o frontend.

- **Socket.IO:** Biblioteca para comunicação em tempo real entre o frontend e o backend.
    
- **SQLite:** Banco de dados leve utilizado para armazenar o histórico de mensagens.
        
- **HTML/CSS/JavaScript:** Tecnologias frontend para a interface do chat.

# Funcionalidades

- **Sistema de Usuários:** Usuários se identificam com um nome antes de iniciar o chat.
    
- **Histórico de Mensagens:** As mensagens são salvas no banco de dados SQLite, permitindo que o usuário veja o histórico ao se reconectar.
    
- **Comunicação em Tempo Real:** As mensagens são enviadas e recebidas em tempo real utilizando o Socket.IO.

# Como rodar o projeto

## Passos para rodar o projeto localmente:

1 - Clone o repositório do projeto:
```bash
git clone https://github.com/MuriloDeSouza/Real_Time_Email_Service.git
```


2 - Acesse a raiz do projeto:
```bash
certificar de que está na raiz do projeto
```

3 - Instale as dependências do projeto:
```bash
npm install express socket.io sqlite3 
```

4 - intale o nodejs:
```bash
yarn ejs
```

5 - rode o comando abaixo:
```bash
node server.js
```

# Conclusão

&emsp; Este projeto demonstra como criar um sistema de chat em tempo real com armazenamento de histórico de mensagens, usando Socket.IO e Express para comunicação em tempo real, SQLite para persistência dos dados, e Docker para facilidade de execução. Este é um projeto de estudo, mas o conhecimento adquirido é aplicável a sistemas reais que requerem comunicação em tempo real e persistência de dados.