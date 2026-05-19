import type { AccessLog, Employee } from '../types/room911.types';

export async function generateAccessHistoryPDF(
  employee: Employee,
  logs: AccessLog[],
  dateRange?: { startDate?: string; endDate?: string }
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const filteredLogs = filterLogsByDateRange(logs, dateRange);
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.accessTimestamp).getTime() - new Date(a.accessTimestamp).getTime()
  );

  const totalAttempts = sortedLogs.length;
  const approvedCount = sortedLogs.filter(l => l.isSuccessful).length;
  const deniedCount = totalAttempts - approvedCount;
  const approvalRate = totalAttempts > 0 ? Math.round((approvedCount / totalAttempts) * 100) : 0;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PAGE_W = 297;
  const PAGE_H = 210;
  const MARGIN = 14;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  const COLORS = {
    primary: [37, 99, 235] as [number, number, number],
    primaryLight: [219, 234, 254] as [number, number, number],
    success: [22, 163, 74] as [number, number, number],
    successLight: [220, 252, 231] as [number, number, number],
    danger: [220, 38, 38] as [number, number, number],
    dangerLight: [254, 226, 226] as [number, number, number],
    headerBg: [15, 23, 42] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    grayLight: [248, 250, 252] as [number, number, number],
    grayMid: [226, 232, 240] as [number, number, number],
    grayText: [100, 116, 139] as [number, number, number],
    darkText: [15, 23, 42] as [number, number, number],
  };

  drawHeader(pdf, PAGE_W, MARGIN, COLORS, employee);

  let y = 38;
  y = drawMetaBand(pdf, y, MARGIN, CONTENT_W, COLORS, employee, dateRange);
  y = drawStatCards(pdf, y, MARGIN, COLORS, totalAttempts, approvedCount, deniedCount, approvalRate);
  y = drawLogsTable(pdf, y, MARGIN, CONTENT_W, COLORS, sortedLogs);

  drawFooter(pdf, PAGE_W, PAGE_H, MARGIN, COLORS);

  const safeFirst = employee.firstName.replace(/\s+/g, '_');
  const safeLast = employee.lastName.replace(/\s+/g, '_');
  pdf.save(`Historial_${safeFirst}_${safeLast}_${formatDateForFilename(new Date())}.pdf`);
}

function filterLogsByDateRange(
  logs: AccessLog[],
  range?: { startDate?: string; endDate?: string }
): AccessLog[] {
  if (!range?.startDate && !range?.endDate) return logs;

  return logs.filter(log => {
    const logDate = new Date(log.accessTimestamp);
    if (range.startDate && logDate < new Date(range.startDate)) return false;
    if (range.endDate) {
      const endOfDay = new Date(range.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (logDate > endOfDay) return false;
    }
    return true;
  });
}

function drawHeader(pdf: any, pageW: number, margin: number, colors: any, employee: any): void {
  pdf.setFillColor(...colors.headerBg);
  pdf.rect(0, 0, pageW, 30, 'F');

  pdf.setFillColor(...colors.primary);
  pdf.rect(0, 0, 4, 30, 'F');

  pdf.setFillColor(...colors.primary);
  pdf.roundedRect(pageW - margin - 28, 8, 28, 10, 2, 2, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(...colors.white);
  pdf.text('ROOM_911', pageW - margin - 14, 14.5, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);
  pdf.text('HISTORIAL DE ACCESOS', margin + 6, 13);

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(148, 163, 184);
  pdf.text('Sistema de Control de Acceso · ROOM_911', margin + 6, 20);

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(186, 230, 253);
  pdf.text(`${employee.firstName} ${employee.lastName}  ·  PIN: ${employee.internalId}`, margin + 6, 27);
}

function drawMetaBand(
  pdf: any,
  y: number,
  margin: number,
  contentW: number,
  colors: any,
  employee: any,
  dateRange?: { startDate?: string; endDate?: string }
): number {
  pdf.setFillColor(...colors.grayLight);
  pdf.rect(margin, y, contentW, 10, 'F');
  pdf.setDrawColor(...colors.grayMid);
  pdf.setLineWidth(0.2);
  pdf.rect(margin, y, contentW, 10, 'D');

  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...colors.grayText);

  const generatedText = `Generado: ${new Date().toLocaleString('es-MX')}`;
  const deptText = `Departamento: ${employee.departmentName || 'N/D'}`;
  const rangeText =
    dateRange?.startDate || dateRange?.endDate
      ? `Período: ${dateRange.startDate || '—'}  →  ${dateRange.endDate || 'hoy'}`
      : 'Período: Todos los registros';

  pdf.text(deptText, margin + 3, y + 6.5);
  pdf.text(rangeText, margin + contentW / 2, y + 6.5, { align: 'center' });
  pdf.text(generatedText, margin + contentW - 3, y + 6.5, { align: 'right' });

  return y + 14;
}

function drawStatCards(
  pdf: any,
  y: number,
  margin: number,
  colors: any,
  total: number,
  approved: number,
  denied: number,
  rate: number
): number {
  const cards = [
    { label: 'Total intentos', value: String(total), bg: colors.primaryLight, accent: colors.primary },
    { label: 'Aprobados', value: String(approved), bg: colors.successLight, accent: colors.success },
    { label: 'Denegados', value: String(denied), bg: colors.dangerLight, accent: colors.danger },
    { label: 'Tasa de éxito', value: `${rate}%`, bg: colors.primaryLight, accent: colors.primary },
  ];

  const cardW = 60;
  const cardH = 18;
  const gap = 5;

  cards.forEach((card, i) => {
    const x = margin + i * (cardW + gap);

    pdf.setFillColor(...card.bg);
    pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'F');

    pdf.setFillColor(...card.accent);
    pdf.roundedRect(x, y, 2.5, cardH, 1, 1, 'F');

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.grayText);
    pdf.text(card.label, x + 6, y + 6.5);

    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...card.accent);
    pdf.text(card.value, x + 6, y + 15);
  });

  return y + cardH + 6;
}

function drawLogsTable(
  pdf: any,
  y: number,
  margin: number,
  contentW: number,
  colors: any,
  logs: AccessLog[]
): number {
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.darkText);
  pdf.text('REGISTROS DE ACCESO', margin, y + 5);

  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y + 7, margin + contentW, y + 7);

  y += 10;

  if (logs.length === 0) {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...colors.grayText);
    pdf.text('No hay registros para el período seleccionado.', margin + contentW / 2, y + 8, { align: 'center' });
    return y + 20;
  }

  const cols = [
    { header: 'Fecha y Hora', width: 52 },
    { header: 'PIN', width: 22 },
    { header: 'Estado', width: 28 },
    { header: 'Observaciones', width: contentW - 52 - 22 - 28 },
  ];

  const ROW_H = 7.5;
  const HEADER_H = 9;
  let currentY = y;

  pdf.setFillColor(...colors.headerBg);
  pdf.rect(margin, currentY, contentW, HEADER_H, 'F');

  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.white);

  let xPos = margin;
  cols.forEach(col => {
    pdf.text(col.header, xPos + 3, currentY + 6);
    xPos += col.width;
  });

  currentY += HEADER_H;

  logs.forEach((log, idx) => {
    if (currentY > 178) {
      pdf.addPage();
      currentY = 15;
    }

    if (idx % 2 === 0) {
      pdf.setFillColor(...colors.grayLight);
      pdf.rect(margin, currentY, contentW, ROW_H, 'F');
    }

    pdf.setDrawColor(...colors.grayMid);
    pdf.setLineWidth(0.1);
    pdf.line(margin, currentY + ROW_H, margin + contentW, currentY + ROW_H);

    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'normal');

    xPos = margin;

    pdf.setTextColor(...colors.darkText);
    const ts = new Date(log.accessTimestamp).toLocaleString('es-MX');
    pdf.text(ts, xPos + 3, currentY + 5);
    xPos += cols[0].width;

    pdf.setFillColor(...colors.primaryLight);
    pdf.roundedRect(xPos + 1, currentY + 1.5, 16, 4.5, 1, 1, 'F');
    pdf.setTextColor(...colors.primary);
    pdf.setFont('helvetica', 'bold');
    pdf.text(log.attemptedInternalId, xPos + 9, currentY + 5, { align: 'center' });
    xPos += cols[1].width;

    if (log.isSuccessful) {
      pdf.setFillColor(...colors.successLight);
      pdf.roundedRect(xPos + 1, currentY + 1.5, 22, 4.5, 1, 1, 'F');
      pdf.setTextColor(...colors.success);
      pdf.text('✓ Aprobado', xPos + 12, currentY + 5, { align: 'center' });
    } else {
      pdf.setFillColor(...colors.dangerLight);
      pdf.roundedRect(xPos + 1, currentY + 1.5, 22, 4.5, 1, 1, 'F');
      pdf.setTextColor(...colors.danger);
      pdf.text('✗ Denegado', xPos + 12, currentY + 5, { align: 'center' });
    }
    xPos += cols[2].width;

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.grayText);
    const detail = (log.reasonDenied || 'Acceso normal').substring(0, 50);
    pdf.text(detail, xPos + 3, currentY + 5);

    currentY += ROW_H;
  });

  pdf.setDrawColor(...colors.primary);
  pdf.setLineWidth(0.3);
  pdf.line(margin, currentY, margin + contentW, currentY);

  return currentY;
}

function drawFooter(pdf: any, pageW: number, pageH: number, margin: number, colors: any): void {
  const totalPages = (pdf as any).internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    pdf.setFillColor(...colors.grayLight);
    pdf.rect(0, pageH - 10, pageW, 10, 'F');
    pdf.setDrawColor(...colors.grayMid);
    pdf.setLineWidth(0.2);
    pdf.line(0, pageH - 10, pageW, pageH - 10);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...colors.grayText);
    pdf.text('ROOM_911 · Documento confidencial · Uso interno exclusivo', margin, pageH - 4);
    pdf.text(`Página ${i} de ${totalPages}`, pageW - margin, pageH - 4, { align: 'right' });
  }
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().slice(0, 10);
}
