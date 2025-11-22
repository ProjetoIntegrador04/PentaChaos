#!/bin/bash
# Script de gerenciamento Docker - PentaChaos
# Bash Script para Linux/Mac

ACTION=${1:-status}

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

function start_services() {
    echo -e "${GREEN}🚀 Iniciando todos os serviços...${NC}"
    docker compose up -d
    echo -e "${GREEN}✅ Serviços iniciados!${NC}"
    echo ""
    echo -e "${CYAN}📱 Acesse:${NC}"
    echo -e "${WHITE}  - Backend: http://localhost:8080${NC}"
    echo -e "${WHITE}  - Mobile:  http://localhost:8081${NC}"
    echo -e "${WHITE}  - DB:      localhost:5432${NC}"
}

function stop_services() {
    echo -e "${YELLOW}⏹️  Parando todos os serviços...${NC}"
    docker compose down
    echo -e "${GREEN}✅ Serviços parados!${NC}"
}

function restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando todos os serviços...${NC}"
    docker compose restart
    echo -e "${GREEN}✅ Serviços reiniciados!${NC}"
}

function show_logs() {
    echo -e "${CYAN}📋 Mostrando logs (Ctrl+C para sair)...${NC}"
    docker compose logs -f
}

function show_status() {
    echo -e "${CYAN}📊 Status dos containers:${NC}"
    docker compose ps
    echo ""
    echo -e "${CYAN}💾 Uso de recursos:${NC}"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

function clean_all() {
    echo -e "${RED}🧹 Limpando tudo (containers, volumes, imagens)...${NC}"
    read -p "Tem certeza? Isso removerá TODOS os dados do banco! (s/N): " confirmation
    if [[ "$confirmation" == "s" ]] || [[ "$confirmation" == "S" ]]; then
        docker compose down -v --rmi all
        echo -e "${GREEN}✅ Limpeza completa!${NC}"
    else
        echo -e "${YELLOW}❌ Operação cancelada${NC}"
    fi
}

function rebuild_all() {
    echo -e "${YELLOW}🔨 Rebuild de todos os serviços...${NC}"
    docker compose up -d --build
    echo -e "${GREEN}✅ Rebuild completo!${NC}"
}

function open_db_shell() {
    echo -e "${CYAN}🗄️  Abrindo shell do PostgreSQL...${NC}"
    echo -e "${YELLOW}Digite '\\q' para sair${NC}"
    docker compose exec db psql -U admin_sge -d sge_app_db
}

function show_backend_logs() {
    echo -e "${CYAN}📋 Logs do Backend (Ctrl+C para sair)...${NC}"
    docker compose logs -f backend
}

function show_mobile_logs() {
    echo -e "${CYAN}📋 Logs do Mobile (Ctrl+C para sair)...${NC}"
    docker compose logs -f mobile
}

function show_help() {
    echo -e "${CYAN}Docker Manager - PentaChaos${NC}"
    echo ""
    echo "Uso: ./docker-manager.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start         - Inicia todos os serviços"
    echo "  stop          - Para todos os serviços"
    echo "  restart       - Reinicia todos os serviços"
    echo "  logs          - Mostra logs de todos os serviços"
    echo "  status        - Mostra status e uso de recursos"
    echo "  clean         - Remove tudo (containers, volumes, imagens)"
    echo "  rebuild       - Rebuild de todos os serviços"
    echo "  db-shell      - Abre shell do PostgreSQL"
    echo "  backend-logs  - Mostra apenas logs do backend"
    echo "  mobile-logs   - Mostra apenas logs do mobile"
    echo "  help          - Mostra esta ajuda"
}

# Main execution
case "$ACTION" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    rebuild)
        rebuild_all
        ;;
    db-shell)
        open_db_shell
        ;;
    backend-logs)
        show_backend_logs
        ;;
    mobile-logs)
        show_mobile_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Comando inválido: $ACTION${NC}"
        show_help
        exit 1
        ;;
esac
