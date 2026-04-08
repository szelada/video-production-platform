import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  renderToBuffer,
  Image,
  Font
} from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1pt solid #eeeeee',
    paddingBottom: 20,
    marginBottom: 40,
  },
  brandArea: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'black',
    letterSpacing: -1,
  },
  companySlogan: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  metaArea: {
    textAlign: 'right',
  },
  documentType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  metaText: {
    fontSize: 8,
    color: '#666',
    marginBottom: 2,
  },
  
  // Client & Project Info
  infoSection: {
    marginBottom: 40,
    flexDirection: 'row',
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },

  // Budget Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottom: '1pt solid #eeeeee',
    padding: '8pt 12pt',
  },
  tableColDesc: { flex: 6, fontSize: 8, fontWeight: 'bold', color: '#64748b' },
  tableColPrice: { flex: 2, fontSize: 8, fontWeight: 'bold', color: '#64748b', textAlign: 'right' },
  tableColQty: { flex: 1, fontSize: 8, fontWeight: 'bold', color: '#64748b', textAlign: 'center' },
  tableColTotal: { flex: 2, fontSize: 8, fontWeight: 'bold', color: '#64748b', textAlign: 'right' },

  sectionRow: {
    backgroundColor: '#f1f5f9',
    padding: '10pt 12pt',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'black',
    color: '#1e293b',
    textTransform: 'uppercase',
    flex: 1,
  },
  sectionSubtotal: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  itemRow: {
    flexDirection: 'row',
    padding: '8pt 12pt',
    borderBottom: '0.5pt solid #eeeeee',
  },
  itemDesc: { flex: 6, fontSize: 9, color: '#334155' },
  itemPrice: { flex: 2, fontSize: 9, color: '#334155', textAlign: 'right' },
  itemQty: { flex: 1, fontSize: 9, color: '#334155', textAlign: 'center' },
  itemTotal: { flex: 2, fontSize: 9, color: '#0f172a', fontWeight: 'bold', textAlign: 'right' },

  // Summary
  summaryContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryBox: {
    width: 200,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 9, color: '#64748b' },
  summaryValue: { fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2pt solid #000000',
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 'black', textTransform: 'uppercase' },
  grandTotalValue: { fontSize: 18, fontWeight: 'black' },

  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    fontSize: 7,
    color: '#cbd5e1',
    textAlign: 'center',
    borderTop: '0.5pt solid #f1f5f9',
    paddingTop: 10,
  }
});

// --- PDF COMPONENT ---
const QuotationPDF = ({ data }: { data: any }) => {
  const { quotation, sections, project } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandArea}>
            <Text style={styles.companyName}>916 STUDIO</Text>
            <Text style={styles.companySlogan}>Visual Intelligence & Production</Text>
          </View>
          <View style={styles.metaArea}>
            <Text style={styles.documentType}>Presupuesto de Producción</Text>
            <Text style={styles.metaText}>REF: QUOTE-{quotation.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.metaText}>FECHA: {new Date(quotation.created_at).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Client & Project */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Cliente / Empresa</Text>
            <Text style={styles.infoValue}>{quotation.client_name}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Proyecto</Text>
            <Text style={styles.infoValue}>{project.name}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableColDesc}>DESCRIPCIÓN DEL SERVICIO</Text>
          <Text style={styles.tableColPrice}>PRECIO UNIT.</Text>
          <Text style={styles.tableColQty}>CANT.</Text>
          <Text style={styles.tableColTotal}>TOTAL NETO</Text>
        </View>

        {/* Hierarchical Sections & Items */}
        {sections.map((sec: any) => (
          <View key={sec.id} wrap={false}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{sec.name}</Text>
              <Text style={styles.sectionSubtotal}>
                SUBTOTAL: $ {Number(sec.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            
            {sec.quotation_items?.map((item: any) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemPrice}>$ {Number(item.unit_price).toLocaleString()}</Text>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <Text style={styles.itemTotal}>$ {Number(item.total).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Summary Footer */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$ {Number(quotation.total_amount).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Markup / Fee (0%)</Text>
              <Text style={styles.summaryValue}>$ 0.00</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Inversión Total</Text>
              <Text style={styles.grandTotalValue}>$ {Number(quotation.total_amount).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Este documento es una cotización preliminar sujeta a disponibilidad de equipos y personal al momento de la aprobación.
          916 STUDIO - LIMA, PERÚ.
        </Text>
      </Page>
    </Document>
  );
};

// --- API ROUTE ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, quotationId: string }> }
) {
  try {
    const { id: projectId, quotationId } = await params;

    // 1. Fetch Quotation + Sections + Items + Project
    const { data: quotation, error: qError } = await supabase
      .from('project_quotations')
      .select('*, projects(name)')
      .eq('id', quotationId)
      .single();

    if (qError || !quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const { data: sections, error: sError } = await supabase
      .from('quotation_sections')
      .select('*, quotation_items(*)')
      .eq('quotation_id', quotationId)
      .order('order', { ascending: true });

    if (sError) throw sError;

    const data = {
      quotation,
      project: quotation.projects,
      sections: sections.map(s => ({
        ...s,
        quotation_items: s.quotation_items.sort((a: any, b: any) => a.order - b.order)
      }))
    };

    // 2. Render PDF to Buffer
    const buffer = await renderToBuffer(<QuotationPDF data={data} />);

    // 3. Return Response
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="COTIZACION_${quotation.client_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
