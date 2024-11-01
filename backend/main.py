from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, status
from backend.database import conectar_supabase
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Monta os arquivos estáticos
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Configura os templates
templates = Jinja2Templates(directory="backend/templates")

# Lista para armazenar as conexões WebSocket
active_connections: List[WebSocket] = []

class UserSchema(BaseModel):
    nome: str
    senha: str

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/cadastrar_usuario/", status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(user: UserSchema):
    supabase = conectar_supabase()
    resultado = supabase.table('to_do').insert({
        "nome": user.nome,
        "senha": user.senha
    }).execute()
    return resultado

# WebSocket para comunicação em tempo real
@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Envia a mensagem para todos os usuários conectados
            for connection in active_connections:
                await connection.send_text(data)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
