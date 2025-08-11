# app/api/__init__.py (modificado)
from fastapi import APIRouter

# Importa os roteadores como módulos DIRETOS do pacote 'api'
# ATENÇÃO: As importações mudaram de 'app.api.endpoints.modulo' para '.modulo'
from . import users
from . import attendances
from . import evaluations
from . import interns
from . import orientadores
from . import reports

# Cria o roteador principal da API (que será importado por app.main)
api_router = APIRouter()

# Inclua os outros roteadores aqui, conforme você for desenvolvendo
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(attendances.router, prefix="/attendances", tags=["attendances"])
api_router.include_router(evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(interns.router, prefix="/interns", tags=["interns"])
api_router.include_router(orientadores.router, prefix="/orientadores", tags=["orientadores"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])