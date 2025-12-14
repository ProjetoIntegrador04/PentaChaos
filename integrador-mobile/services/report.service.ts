/**
 * Serviço de Geração de Relatórios em PDF
 * Gera relatórios de frequência, squads e atividades
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt: Date;
  userData: {
    name: string;
    email: string;
    ra?: string;
  };
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  data: ReportItem[];
}

export interface ReportItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

class ReportService {
  /**
   * Gera HTML formatado para o relatório
   */
  private generateHTML(data: ReportData): string {
    const sectionsHTML = data.sections
      .map(
        (section, sectionIndex) => `
        <div class="section">
          <h2>${section.title}</h2>
          <table>
            ${section.data
              .map(
                item => {
                  // Adiciona classe especial para seção de usuários
                  const isUserSection = section.title.includes('Usuários');
                  const rowClass = item.highlight ? 'highlight' : (isUserSection ? 'user-row' : '');
                  
                  return `
              <tr class="${rowClass}">
                <td class="label">${item.label}</td>
                <td class="value">${item.value}</td>
              </tr>
            `;
                }
              )
              .join('')}
          </table>
        </div>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              padding: 40px;
              background: #fff;
              color: #333;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #0A4A8E;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .logo {
              color: #0A4A8E;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            h1 {
              color: #0A4A8E;
              font-size: 24px;
              margin-bottom: 8px;
            }
            
            .subtitle {
              color: #666;
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .generated-at {
              color: #999;
              font-size: 12px;
            }
            
            .user-info {
              background: #f5f7fa;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            
            .user-info p {
              margin: 4px 0;
              font-size: 14px;
            }
            
            .user-info strong {
              color: #0A4A8E;
            }
            
            .section {
              margin-bottom: 30px;
            }
            
            h2 {
              color: #0A4A8E;
              font-size: 18px;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e0e0e0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            
            tr {
              border-bottom: 1px solid #e0e0e0;
            }
            
            tr:nth-child(even) {
              background: #fafafa;
            }
            
            tr.highlight {
              background: #fff3e0;
              font-weight: bold;
            }
            
            td {
              padding: 12px 8px;
              font-size: 14px;
            }
            
            td.label {
              color: #666;
              width: 50%;
              font-weight: 500;
            }
            
            td.value {
              color: #333;
              text-align: right;
              font-weight: 500;
              width: 50%;
            }
            
            .user-row td.label {
              color: #0A4A8E;
              font-weight: 600;
            }
            
            .user-row td.value {
              font-family: 'Courier New', monospace;
              font-size: 13px;
            }
            
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #999;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PENTACHAOS</div>
            <h1>${data.title}</h1>
            ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
            <p class="generated-at">Gerado em: ${data.generatedAt.toLocaleString('pt-BR')}</p>
          </div>
          
          <div class="user-info">
            <p><strong>Nome:</strong> ${data.userData.name}</p>
            <p><strong>Email:</strong> ${data.userData.email}</p>
            ${data.userData.ra ? `<p><strong>RA:</strong> ${data.userData.ra}</p>` : ''}
          </div>
          
          ${sectionsHTML}
          
          <div class="footer">
            <p>Sistema de Gestão de Estagiários - PentaChaos</p>
            <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Gera e compartilha um relatório em PDF
   */
  async generateAndShareReport(data: ReportData): Promise<void> {
    try {
      // Verifica se o dispositivo suporta compartilhamento
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
        return;
      }

      // Gera o HTML
      const html = this.generateHTML(data);

      // Converte para PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Compartilha o PDF diretamente
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar Relatório',
        UTI: 'com.adobe.pdf',
      });

      console.log('✅ Relatório gerado e compartilhado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
      throw error;
    }
  }

  /**
   * Gera relatório de frequência
   */
  async generateFrequencyReport(
    userData: ReportData['userData'],
    frequencyData: {
      presencas: number;
      faltas: number;
      percentual: number;
      periodo: string;
    }
  ): Promise<void> {
    const reportData: ReportData = {
      title: 'Relatório de Frequência',
      subtitle: `Período: ${frequencyData.periodo}`,
      generatedAt: new Date(),
      userData,
      sections: [
        {
          title: 'Resumo de Frequência',
          data: [
            { label: 'Presenças Registradas', value: frequencyData.presencas },
            { label: 'Faltas', value: frequencyData.faltas },
            { label: 'Taxa de Frequência', value: `${frequencyData.percentual}%`, highlight: true },
          ],
        },
      ],
    };

    await this.generateAndShareReport(reportData);
  }

  /**
   * Gera relatório de squads
   */
  async generateSquadsReport(
    userData: ReportData['userData'],
    squadsData: {
      totalSquads: number;
      mySquads: string[];
      totalMembers: number;
    }
  ): Promise<void> {
    const reportData: ReportData = {
      title: 'Relatório de Squads',
      subtitle: 'Informações sobre equipes',
      generatedAt: new Date(),
      userData,
      sections: [
        {
          title: 'Estatísticas Gerais',
          data: [
            { label: 'Total de Squads', value: squadsData.totalSquads },
            { label: 'Minhas Squads', value: squadsData.mySquads.length },
            { label: 'Total de Membros', value: squadsData.totalMembers },
          ],
        },
        {
          title: 'Squads que Participo',
          data: squadsData.mySquads.map((squad, index) => ({
            label: `Squad ${index + 1}`,
            value: squad,
          })),
        },
      ],
    };

    await this.generateAndShareReport(reportData);
  }

  /**
   * Gera relatório completo do dashboard com dados de todos os usuários
   */
  async generateDashboardReport(
    userData: ReportData['userData'],
    dashboardData: {
      frequencyData: {
        presencas: number;
        faltas: number;
        percentual: number;
      };
      squadsData: {
        totalSquads: number;
        mySquads: string[];
      };
      allUsersData?: {
        name: string;
        email: string;
        frequencyPercentage: number;
        completedTasks: number;
        totalTasks: number;
      }[];
    }
  ): Promise<void> {
    const sections: ReportSection[] = [
      {
        title: 'Frequência',
        data: [
          { label: 'Presenças', value: dashboardData.frequencyData.presencas },
          { label: 'Faltas', value: dashboardData.frequencyData.faltas },
          { 
            label: 'Taxa de Frequência', 
            value: `${dashboardData.frequencyData.percentual}%`, 
            highlight: true 
          },
        ],
      },
      {
        title: 'Squads',
        data: [
          { label: 'Total de Squads', value: dashboardData.squadsData.totalSquads },
          { label: 'Minhas Squads', value: dashboardData.squadsData.mySquads.length },
        ],
      },
    ];

    // Adiciona seção com dados de todos os usuários se disponível
    if (dashboardData.allUsersData && dashboardData.allUsersData.length > 0) {
      sections.push({
        title: 'Todos os Usuários - Frequência e Tarefas',
        data: dashboardData.allUsersData.map(user => ({
          label: `${user.name}`,
          value: `Freq: ${user.frequencyPercentage.toFixed(1)}% | Tarefas: ${user.completedTasks}/${user.totalTasks}`,
          highlight: false
        })),
      });
    }

    const reportData: ReportData = {
      title: 'Relatório Completo do Dashboard',
      subtitle: 'Visão geral de todas as atividades e usuários',
      generatedAt: new Date(),
      userData,
      sections,
    };

    await this.generateAndShareReport(reportData);
  }
}

export default new ReportService();
