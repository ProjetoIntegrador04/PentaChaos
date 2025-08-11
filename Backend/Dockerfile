# Usa uma imagem base Python oficial leve
FROM python:3.10-slim-buster

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo de dependências e instala as dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação para o container
COPY ./app /app/app

# Expõe a porta que o FastAPI vai rodar (padrão 8000 para Uvicorn)
EXPOSE 8000

# Comando para rodar a aplicação com Uvicorn
# 'app.main:app' refere-se ao objeto 'app' dentro de 'app/main.py'
# '--host 0.0.0.0' permite que a aplicação seja acessível de fora do container
# O modo --reload é bom para desenvolvimento, mas remova em produção.# 
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]