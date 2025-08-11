from fastapi import FastAPI
from app.core.config import settings
from app.db.base_class import Base # Importa a Base declarativa do SQLAlchemy
from app.db.session import engine # Importa a engine para criar tabelas
from app.api import api_router # Importa o 'api_router' definido em app/api/__init__.py

# --- Inicialização do FastAPI ---
# Configura o aplicativo FastAPI utilizando as definições do seu arquivo settings.py
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para gerenciar estágios, alunos, orientadores e avaliações.",
    version="0.0.1", # Versão da API, pode ser gerenciada em settings.py
    debug=settings.DEBUG, # Ativa/desativa o modo debug, vindo de settings.py
    openapi_url="/openapi.json", # URL para o arquivo de especificação OpenAPI
    docs_url="/docs", # URL para a documentação interativa (Swagger UI)
    redoc_url="/redoc" # URL para a documentação alternativa (ReDoc)
)

# --- INÍCIO: ALTERAÇÕES IMPORTANTES PARA O BANCO DE DADOS ASSÍNCRONO ---

# REMOVIDO: Base.metadata.create_all(bind=engine) aqui!
# Esta linha síncrona foi movida para dentro do @app.on_event("startup") abaixo.

# --- Eventos de Inicialização e Encerramento da Aplicação ---
# `on_event("startup")` executa funções assim que a aplicação FastAPI inicia.
# `on_event("shutdown")` executa funções quando a aplicação FastAPI é encerrada.
# Podem ser usados para inicializar conexões com outros serviços, carregar dados, etc.
@app.on_event("startup")
async def startup_event():
    """
    Função executada na inicialização da aplicação.
    Útil para configurar recursos antes que as requisições comecem,
    incluindo a criação/verificação de tabelas do banco de dados.
    """
    print("Aplicação iniciada. Verificando/criando tabelas do banco de dados...")
    # Para executar Base.metadata.create_all (que é síncrono) com uma AsyncEngine,
    # precisamos de uma conexão assíncrona e usar 'run_sync()'.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tabelas do banco de dados criadas/verificadas com sucesso!")
    print("Aplicação pronta para receber requisições.")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Função executada no encerramento da aplicação.
    Útil para limpar recursos, fechar conexões, etc.
    """
    print("Aplicação encerrando.")

# --- FIM: ALTERAÇÕES IMPORTANTES ---

# --- Inclusão das Rotas da API (Endpoints) ---
# O 'api_router' centraliza todos os roteadores de endpoints específicos (como /users, /attendances, etc.).
# Ao incluí-lo aqui, todos os endpoints que você definiu em 'app/api/endpoints/*'
# e agregou em 'app/api/__init__.py' se tornam acessíveis pela sua API.
app.include_router(api_router)

# --- Endpoint de Teste Simples (Rota Raiz) ---
# Adiciona uma rota de "saúde" ou "home" para verificar se a aplicação está online.
# Pode ser acessada em http://localhost:8000/
@app.get("/", summary="Verifica o status da API")
def read_root():
    """
    Endpoint de teste para verificar se a API está online e respondendo.
    Retorna uma mensagem de boas-vindas e o status da API.
    """
    return {"message": "Bem-vindo ao Sistema de Gestão de Estágios!", "api_status": "online"}


# --- Outras Configurações (Futuras) ---
# Você pode adicionar mais configurações aqui conforme o projeto evolui, como:
# - Middlewares (CORS, autenticação, loggers personalizados)
# - Tratamento global de exceções
# - Conexão com outros serviços (cache, filas de mensagem)