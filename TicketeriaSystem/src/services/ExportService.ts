import { Ticket } from '@/interfaces/Ticket';
import { Platform } from 'react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';

export class ExportService {
  private static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  private static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      open: 'Aberto',
      in_progress: 'Em Andamento',
      resolved: 'Resolvido',
      closed: 'Fechado',
    };
    return labels[status] || status;
  }

  private static getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return labels[priority] || priority;
  }

  static async exportToPDF(tickets: Ticket[]): Promise<void> {
    try {
      const html = this.generatePDFHTML(tickets);

      const options = {
        html,
        fileName: `tickets_${new Date().getTime()}`,
        base64: false
      };

      const file = await generatePDF(options);

      if (file.filePath) {
        await Share.open({
          url: Platform.OS === 'android' ? `file://${file.filePath}` : file.filePath,
          type: 'application/pdf',
          title: 'Exportar Tickets',
          saveToFiles: true,

        });
      }
    } catch (error: unknown) {
      // User did not share
      if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message === 'User did not share') {
        return;
      }
      console.error('Erro ao exportar PDF:', error);
      throw new Error('Falha ao exportar para PDF');
    }
  }

  private static generatePDFHTML(tickets: Ticket[]): string {
    const ticketRows = tickets
      .map(
        (ticket) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${ticket.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ticket.title}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.getStatusLabel(ticket.status)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.getPriorityLabel(ticket.priority)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${this.formatDate(ticket.createdAt)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #007AFF;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #007AFF;
              color: white;
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>Lista de Tickets</h1>
          <p>Total de tickets: ${tickets.length}</p>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              ${ticketRows}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Relatório gerado pelo Sistema de Ticketeria</p>
          </div>
        </body>
      </html>
    `;
  }

  static async exportToCSV(tickets: Ticket[]): Promise<void> {
    try {
      const csv = this.generateCSV(tickets);

      // Para iOS/Android, vamos usar Share para compartilhar o CSV
      await Share.open({
        title: 'Exportar Tickets CSV',
        message: csv,
        subject: 'Tickets Export',
        filename: `tickets_${new Date().getTime()}.csv`,
        type: 'text/csv',
      });
    } catch (error) {
      // User did not share
      if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message === 'User did not share') {
        return;
      }
      console.error('Erro ao exportar CSV:', error);
      throw new Error('Falha ao exportar para CSV');
    }
  }

  private static generateCSV(tickets: Ticket[]): string {
    const headers = ['ID', 'Título', 'Descrição', 'Status', 'Prioridade', 'Criado em'];
    const rows = tickets.map((ticket) => [
      ticket.id,
      `"${ticket.title.replace(/"/g, '""')}"`,
      `"${ticket.description.replace(/"/g, '""')}"`,
      this.getStatusLabel(ticket.status),
      this.getPriorityLabel(ticket.priority),
      this.formatDate(ticket.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }
}
