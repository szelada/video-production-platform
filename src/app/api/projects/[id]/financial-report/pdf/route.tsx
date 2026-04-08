import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  renderToBuffer
} from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { borderBottom: '2pt solid #000', paddingBottom: 15, marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  brandTitle: { fontSize: 28, fontWeight: 'black', letterSpacing: -1.5 },
  reportTitle: { fontSize: 10, color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  
  // Summary Cards
  summaryGrid: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  card: { flex: 1, padding: 15, backgroundColor: '#f8fafc', borderRadius: 8, border: '1pt solid #f1f5f9' },
  cardLabel: { fontSize: 7, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 5 },
  cardValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  cardSub: { fontSize: 7, color: '#94a3b8', marginTop: 3 },
  
  // Section Headers
  sectionHeader: { backgroundColor: '#1e293b', color: '#fff', padding: '6pt 12pt', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, borderRadius: 2 },
  
  // Tables
  tableHeader: { flexDirection: 'row', borderBottom: '1pt solid #e2e8f0', paddingBottom: 5, marginBottom: 5 },
  tableRow: { flexDirection: 'row', borderBottom: '0.5pt solid #f1f5f9', paddingVertical: 6, alignItems: 'center' },
  colDesc: { flex: 4, fontSize: 8, color: '#334155' },
  colVal: { flex: 2, fontSize: 8, color: '#334155', textAlign: 'right' },
  colVar: { flex: 2, fontSize: 8, fontWeight: 'bold', textAlign: 'right' },
  
  // Highlights
  positive: { color: '#10b981' },
  negative: { color: '#ef4444' },
  
  // Signature Area
  signatureArea: { marginTop: 60, borderTop: '1pt solid #e2e8f0', paddingTop: 20, width: 200 },
  signatureLine: { borderBottom: '1pt solid #000', marginBottom: 5, height: 30 },
  signatureLabel: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  signatureSub: { fontSize: 7, color: '#94a3b8' },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 7, color: '#cbd5e1', textAlign: 'center', borderTop: '0.5pt solid #f1f5f9', paddingTop: 10 }
});

// --- PDF COMPONENT ---
const FinancialReportPDF = ({ data }: { data: any }) => {
  const { project, financials, expenses, categories } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>916 STUDIO</Text>
            <Text style={{ fontSize: 8, color: '#666', textTransform: 'uppercase', letterSpacing: 1.5 }}>Visual Intelligence Hub</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.reportTitle}>Reporte de Rentabilidad Ejecutiva</Text>
            <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 5 }}>PROYECTO: {project.name}</Text>
            <Text style={{ fontSize: 8, color: '#94a3b8' }}>FECHA EMISIÓN: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Top Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Ingreso (Aprobado)</Text>
            <Text style={styles.cardValue}>$ {financials.revenue.toLocaleString()}</Text>
            <Text style={styles.cardSub}>Basado en Cotización</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Gasto Real</Text>
            <Text style={styles.cardValue}>$ {financials.actual.toLocaleString()}</Text>
            <Text style={styles.cardSub}>{((financials.actual / (financials.revenue || 1)) * 100).toFixed(1)}% del ingreso</Text>
          </View>
          <View style={{ ...styles.card, backgroundColor: financials.margin >= 0 ? '#f0fdf4' : '#fef2f2' }}>
            <Text style={styles.cardLabel}>Utilidad Neta</Text>
            <Text style={{ ...styles.cardValue, color: financials.margin >= 0 ? '#166534' : '#991b1b' }}>
              $ {financials.margin.toLocaleString()}
            </Text>
            <Text style={styles.cardSub}>
              Margen: {((financials.margin / (financials.revenue || 1)) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Categorical Analysis */}
        <View style={styles.sectionHeader}><Text>Análisis por Categoría (Presupuesto vs Real)</Text></View>
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.colDesc, fontWeight: 'bold' }}>CATEGORÍA</Text>
          <Text style={{ ...styles.colVal, fontWeight: 'bold' }}>PLANIFICADO</Text>
          <Text style={{ ...styles.colVal, fontWeight: 'bold' }}>REAL</Text>
          <Text style={{ ...styles.colVar, fontWeight: 'bold' }}>VARIACION</Text>
        </View>
        {categories.map((cat: any, i: number) => {
          const variance = cat.planned - cat.actual;
          return (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{cat.label}</Text>
              <Text style={styles.colVal}>$ {cat.planned.toLocaleString()}</Text>
              <Text style={styles.colVal}>$ {cat.actual.toLocaleString()}</Text>
              <Text style={{ ...styles.colVar, color: variance >= 0 ? '#10b981' : '#ef4444' }}>
                {variance >= 0 ? '+' : ''}$ {variance.toLocaleString()}
              </Text>
            </View>
          );
        })}

        {/* Expense Log */}
        <View style={{ ...styles.sectionHeader, marginTop: 30 }}><Text>Log Detallado de Gastos</Text></View>
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.colDesc, fontWeight: 'bold' }}>DESCRIPCIÓN / CONCEPTO</Text>
          <Text style={{ ...styles.colVal, fontWeight: 'bold', flex: 2 }}>PROVEEDOR</Text>
          <Text style={{ ...styles.colVal, fontWeight: 'bold' }}>FECHA</Text>
          <Text style={{ ...styles.colVar, fontWeight: 'bold' }}>MONTO</Text>
        </View>
        {expenses.slice(0, 15).map((exp: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colDesc}>{exp.description}</Text>
            <Text style={{ ...styles.colVal, flex: 2, textAlign: 'left' }}>{exp.suppliers?.name || 'Varios'}</Text>
            <Text style={styles.colVal}>{new Date(exp.expense_date).toLocaleDateString()}</Text>
            <Text style={styles.colVar}>$ {Number(exp.amount).toLocaleString()}</Text>
          </View>
        ))}
        {expenses.length > 15 && <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 5, fontStyle: 'italic' }}>* Mostrando los últimos 15 gastos. Listado completo disponible en Dashboard.</Text>}

        {/* Signature Area */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Aprobado por Productor Ejecutivo</Text>
          <Text style={styles.signatureSub}>916 STUDIO - Regie Division</Text>
        </View>

        <Text style={styles.footer}>
          Reporte generado automáticamente por el Production Hub de 916 STUDIO. 
          Confidencial y para uso interno/ejecutivo.
        </Text>
      </Page>
    </Document>
  );
};

// --- API ROUTE ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    // 1. Fetch Project
    const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();

    // 2. Fetch Aggregated Data
    const { data: quotes } = await supabase.from('project_quotations').select('total_amount').eq('project_id', projectId).eq('status', 'approved');
    const { data: budgets } = await supabase.from('project_budgets').select('*').eq('project_id', projectId);
    const { data: expenses } = await supabase.from('project_expenses').select('*, suppliers(name)').eq('project_id', projectId).order('expense_date', { ascending: false });

    // 3. Process Data
    const totalRevenue = quotes?.reduce((sum, q) => sum + Number(q.total_amount), 0) || 0;
    const totalPlanned = budgets?.reduce((sum, b) => sum + Number(b.planned_amount), 0) || 0;
    const totalActual = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

    const catLabels: Record<string, string> = {
      crew: 'Personal / Crew',
      equipment: 'Equipamiento',
      locations: 'Locaciones',
      transport: 'Transporte',
      catering: 'Catering',
      postproduction: 'Post-Producción',
      misc: 'Otros / Varios'
    };

    const processedCategories = Object.keys(catLabels).map(key => {
      const p = budgets?.filter(b => b.category === key).reduce((sum, b) => sum + Number(b.planned_amount), 0) || 0;
      const a = expenses?.filter(e => e.category === key).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      return { label: catLabels[key], planned: p, actual: a };
    });

    const data = {
      project,
      financials: { revenue: totalRevenue, planned: totalPlanned, actual: totalActual, margin: totalRevenue - totalActual },
      expenses: expenses || [],
      categories: processedCategories
    };

    // 4. Render PDF
    const buffer = await renderToBuffer(<FinancialReportPDF data={data} />);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="REPORTE_REGIE_${project.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Financial PDF Error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
