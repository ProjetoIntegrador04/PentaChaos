/**
 * Serviço de Dashboard
 * Agrega dados de squads, frequência e estatísticas
 */

import api from './api';
import squadService from './squad.service';
import clockEntryService from './clockentry.service';
import { Squad } from '../types/squad.types';

export interface DashboardStats {
  totalSquads: number;
  totalMembers: number;
  frequencyRate: number;
  presencas: number;
  faltas: number;
}

class DashboardService {
  /**
   * Busca dados consolidados do dashboard
   */
  async getDashboardData(): Promise<{
    squads: Squad[];
    stats: DashboardStats;
  }> {
    try {
      // Busca squads
      const squads = await squadService.getAllSquads();

      // Calcula estatísticas
      const totalSquads = squads.length;
      const totalMembers = squads.reduce((sum, squad) => sum + squad.memberCount, 0);

      // Busca pontos do usuário nos últimos 30 dias
      const hoje = new Date();
      const trintaDiasAtras = new Date(hoje);
      trintaDiasAtras.setDate(hoje.getDate() - 30);

      let presencas = 0;
      let faltas = 0;
      let frequencyRate = 0;

      try {
        // Buscar frequência diretamente do backend (mesmo cálculo que o frontend usa)
        frequencyRate = await clockEntryService.buscarFrequencia(30);
        
        // Buscar pontos para calcular presenças e faltas
        const pontos = await clockEntryService.buscarHistorico(
          trintaDiasAtras.toISOString().split('T')[0],
          hoje.toISOString().split('T')[0]
        );

        // Conta dias com entrada (presença)
        const diasComEntrada = new Set(
          pontos
            .filter(p => p.tipo === 'ENTRY')
            .map(p => new Date(p.timestamp).toLocaleDateString())
        );

        presencas = diasComEntrada.size;
        
        // Calcula dias úteis REAIS no período (segunda a sexta)
        let diasUteis = 0;
        const dataAtual = new Date(trintaDiasAtras);
        while (dataAtual <= hoje) {
          const diaSemana = dataAtual.getDay();
          if (diaSemana !== 0 && diaSemana !== 6) { // 0=domingo, 6=sábado
            diasUteis++;
          }
          dataAtual.setDate(dataAtual.getDate() + 1);
        }
        
        faltas = Math.max(0, diasUteis - presencas);
        // frequencyRate já vem do backend
      } catch (error) {
        console.log('⚠️ Erro ao calcular frequência, usando valores padrão');
      }

      const stats: DashboardStats = {
        totalSquads,
        totalMembers,
        frequencyRate: Math.round(frequencyRate),
        presencas,
        faltas,
      };

      return { squads, stats };
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de frequência de um período específico
   */
  async getFrequencyStats(startDate: string, endDate: string): Promise<{
    presencas: number;
    faltas: number;
    percentual: number;
  }> {
    try {
      const pontos = await clockEntryService.buscarHistorico(startDate, endDate);

      // Conta dias com entrada
      const diasComEntrada = new Set(
        pontos
          .filter(p => p.tipo === 'ENTRY')
          .map(p => new Date(p.timestamp).toLocaleDateString())
      );

      const presencas = diasComEntrada.size;

      // Calcula dias úteis no período
      const inicio = new Date(startDate);
      const fim = new Date(endDate);
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diasUteis = Math.ceil(diffDays * 0.71); // ~71% são dias úteis

      const faltas = Math.max(0, diasUteis - presencas);
      const percentual = diasUteis > 0 ? (presencas / diasUteis) * 100 : 0;

      return {
        presencas,
        faltas,
        percentual: Math.round(percentual),
      };
    } catch (error: any) {
      console.error('❌ Erro ao calcular frequência:', error);
      return { presencas: 0, faltas: 0, percentual: 0 };
    }
  }
}

export default new DashboardService();
