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
  Image
} from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2pt solid #000000',
    paddingBottom: 15,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  reportMeta: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  metaText: {
    fontSize: 9,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  notesBox: {
    borderLeft: '3pt solid #eeeeee',
    paddingLeft: 15,
    marginVertical: 10,
  },
  notesText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
    fontStyle: 'italic',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  photoContainer: {
    width: '48%',
    height: 200,
    marginBottom: 10,
    border: '0.5pt solid #eeeeee',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  entityInfo: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 4,
    border: '0.5pt solid #eeeeee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    width: 100,
    color: '#666',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
    color: '#000',
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
const ScoutingReportPDF = ({ data }: { data: any }) => {
  const isLocation = data.report.scouting_type === 'location';
  const isCasting = data.report.scouting_type === 'casting';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.projectTitle}>{data.project?.name || 'PRODUCTION SCOUT'}</Text>
          <View style={styles.reportMeta}>
            <Text style={styles.reportTitle}>SCOUTING REPORT: {data.report.scouting_type}</Text>
            <Text style={styles.metaText}>DATE: {new Date(data.report.created_at).toLocaleDateString()}</Text>
          </View>
          <Text style={[styles.metaText, { marginTop: 4 }]}>REPORTED BY: {data.report.profiles?.full_name || 'FIELD ASSISTANT'}</Text>
        </View>

        {/* Main Content: Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVATIONS & NOTES</Text>
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>{data.report.notes || 'No notes provided.'}</Text>
          </View>
        </View>

        {/* Conditional Sections */}
        {isLocation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LOCATION DETAILS (PRELIMINARY)</Text>
            <View style={styles.entityInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TYPE:</Text>
                <Text style={styles.infoValue}>LOCATION SCOUT</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>STATUS:</Text>
                <Text style={styles.infoValue}>{data.report.status?.toUpperCase() || 'PENDING'}</Text>
              </View>
              {/* If we had direct entity info, we'd map it here */}
              <Text style={{ fontSize: 8, color: '#999', marginTop: 10, fontStyle: 'italic' }}>
                Note: Specific location profile details are linked via project records.
              </Text>
            </View>
          </View>
        )}

        {isCasting && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CASTING OBSERVATIONS</Text>
            <View style={styles.entityInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TYPE:</Text>
                <Text style={styles.infoValue}>TALENT SCOUT</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>STATUS:</Text>
                <Text style={styles.infoValue}>{data.report.status?.toUpperCase() || 'PENDING'}</Text>
              </View>
              <Text style={{ fontSize: 8, color: '#999', marginTop: 10, fontStyle: 'italic' }}>
                Note: Full casting profiles are available in the project dashboard.
              </Text>
            </View>
          </View>
        )}

        {/* Photo Gallery */}
        {data.photos?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PHOTO GALLERY ({data.photos.length})</Text>
            <View style={styles.photoGrid}>
              {data.photos.map((photo: any, i: number) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image src={photo.file_url} style={styles.photo} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>GENERATED: {new Date().toLocaleString()}</Text>
          <Text>916 STUDIO PLATFORM - PRODUCTION LOGISTICS</Text>
        </View>
      </Page>
    </Document>
  );
};

// --- API ROUTE ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }

    // Fetch Report Data
    const { data: report, error: reportError } = await supabase
      .from('scouting_reports')
      .select('*, profiles(full_name), projects(name)')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Fetch Photos
    const { data: photos } = await supabase
      .from('scouting_report_photos')
      .select('*')
      .eq('scouting_report_id', reportId);

    const data = {
      report,
      project: report.projects,
      photos: photos || []
    };

    // Render PDF to Buffer
    const buffer = await renderToBuffer(<ScoutingReportPDF data={data} />);

    // Return Response
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ScoutingReport_${data.project?.name || 'Project'}_${new Date(data.report.created_at).toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
