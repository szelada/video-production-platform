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
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #000000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
    paddingVertical: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 4,
    backgroundColor: '#fafafa',
  },
  tableCol: {
    flex: 1,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '0.5pt solid #eeeeee',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#999',
  }
});

// --- PDF COMPONENT ---
const CallSheetPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{data.project?.name || 'PROJECT CALL SHEET'}</Text>
        <Text style={styles.subTitle}>SHOOT DATE: {data.callSheet?.shoot_date || ''}</Text>
        <Text style={styles.subTitle}>LOCATION: {data.callSheet?.locations?.name || 'TBD'}</Text>
        {data.callSheet?.locations?.address && (
          <Text style={styles.subTitle}>ADDRESS: {data.callSheet.locations.address}</Text>
        )}
      </View>

      {/* General Notes */}
      {data.callSheet?.general_notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GENERAL NOTES</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{data.callSheet.general_notes}</Text>
        </View>
      )}

      {/* Crew Call Times */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CREW CALL TIMES</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <View style={[styles.tableCol, { flex: 2 }]}><Text style={styles.tableCellHeader}>MEMBER</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>ROLE</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>CALL TIME</Text></View>
            <View style={[styles.tableCol, { flex: 2 }]}><Text style={styles.tableCellHeader}>NOTES</Text></View>
          </View>
          {data.crew?.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={[styles.tableCol, { flex: 2 }]}><Text style={styles.tableCell}>{item.profiles?.full_name}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.role_notes || 'Crew'}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.call_time}</Text></View>
              <View style={[styles.tableCol, { flex: 2 }]}><Text style={styles.tableCell}>{item.notes || ''}</Text></View>
            </View>
          ))}
        </View>
      </View>

      {/* Day Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DAY SCHEDULE</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>TIME</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCellHeader}>SCENE</Text></View>
            <View style={[styles.tableCol, { flex: 3 }]}><Text style={styles.tableCellHeader}>DESCRIPTION</Text></View>
          </View>
          {data.schedule?.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.time_start} - {item.time_end}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.scene}</Text></View>
              <View style={[styles.tableCol, { flex: 3 }]}><Text style={styles.tableCell}>{item.description}</Text></View>
            </View>
          ))}
        </View>
      </View>

      {/* Transport */}
      {data.transport?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRANSPORT SUMMARY</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>PASSENGER</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>ORIGIN</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>DESTINATION</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>PICKUP</Text></View>
            </View>
            {data.transport.map((item: any) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.profiles?.full_name}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.pickup_location}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.dropoff_location}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.pickup_time}</Text></View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Catering */}
      {data.catering?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATERING SUMMARY</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>MEAL TYPE</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>COUNT</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCellHeader}>SUPPLIER</Text></View>
            </View>
            {data.catering.map((item: any) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.meal_type.toUpperCase()}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.crew_count}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{item.suppliers?.name}</Text></View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>GENERATED: {new Date().toLocaleString()}</Text>
        <Text>916 STUDIO PLATFORM</Text>
      </View>
    </Page>
  </Document>
);

// --- API ROUTE ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; callSheetId: string }> }
) {
  try {
    const { id: projectId, callSheetId } = await params;

    // Fetch All Data
    const [projectRes, callSheetRes, crewRes, scheduleRes, transportRes, cateringRes] = await Promise.all([
      supabase.from('projects').select('name').eq('id', projectId).single(),
      supabase.from('call_sheets').select('*, locations(*)').eq('id', callSheetId).single(),
      supabase.from('call_sheet_crew').select('*, profiles(full_name)').eq('call_sheet_id', callSheetId),
      supabase.from('call_sheet_schedule').select('*').eq('call_sheet_id', callSheetId).order('time_start'),
      supabase.from('transport_requests').select('*, profiles(full_name)').eq('call_sheet_id', callSheetId),
      supabase.from('catering_orders').select('*, suppliers(name)').eq('call_sheet_id', callSheetId)
    ]);

    const data = {
      project: projectRes.data,
      callSheet: callSheetRes.data,
      crew: crewRes.data,
      schedule: scheduleRes.data,
      transport: transportRes.data,
      catering: cateringRes.data
    };

    // Render PDF to Buffer
    const buffer = await renderToBuffer(<CallSheetPDF data={data} />);

    // Return Response
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CallSheet_${data.project?.name || 'Project'}_${data.callSheet?.shoot_date || ''}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
