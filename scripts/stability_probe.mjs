
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oklolzzseflhgucvfhef.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbG9senpzZWZsaGd1Y3ZmaGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTkyNTgsImV4cCI6MjA4ODY5NTI1OH0.TmbWjLs9Clkm5MaK54S9gH4ghVnTnTIJ5qhJ_34Hh18';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function validateFinal() {
  console.log('--- FINAL END-TO-END VALIDATION ---');
  
  // 0. Setup: Get an existing project
  const { data: project } = await supabase.from('projects').select('id, name').limit(1).single();
  
  if (!project) {
    console.error('❌ FATAL: No projects found in DB. Need at least one to validate.');
    return;
  }
  const projectId = project.id;
  console.log(`Using Project: ${project.name} (${projectId})\n`);

  const report = {
    activity: 'FAIL',
    suppliers: 'FAIL',
    relations: 'FAIL',
    scouting: 'FAIL'
  };

  const errors = [];

  // 1. ACTIVITY FEED
  console.log('1. ACTIVITY FEED:');
  const testActivity = { project_id: projectId, action: 'Validation Check', description: 'Testing feed stability' };
  const { data: actData, error: actError } = await supabase.from('project_activity').insert([testActivity]).select();
  if (actError) {
    errors.push(`Activity Insert: ${actError.message}`);
  } else {
    const { data: feed, error: feedError } = await supabase.from('project_activity')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (feedError) {
      errors.push(`Activity Select: ${feedError.message}`);
    } else {
      if (feed[0].id === actData[0].id) {
        console.log('   ✅ INSERT/SELECT/ORDER PASS');
        report.activity = 'PASS';
      } else {
        errors.push('Activity Ordering: Newest first fail');
      }
    }
  }

  // 2. SUPPLIERS
  console.log('2. SUPPLIERS:');
  const testSup = { name: 'Validation Vendor', category: 'Catering' };
  const { data: supData, error: supError } = await supabase.from('suppliers').insert([testSup]).select();
  if (supError) {
    errors.push(`Supplier Insert: ${supError.message}`);
  } else {
    const { error: updError } = await supabase.from('suppliers').update({ rating: 4 }).eq('id', supData[0].id);
    if (updError) {
      errors.push(`Supplier Update: ${updError.message}`);
    } else {
      const { data: sLoad, error: sLoadError } = await supabase.from('suppliers').select('*').eq('id', supData[0].id);
      if (sLoadError || !sLoad[0]) {
        errors.push(`Supplier Select: ${sLoadError?.message}`);
      } else {
        console.log('   ✅ INSERT/UPDATE/SELECT PASS');
        report.suppliers = 'PASS';
      }
    }
  }

  // 3. PROJECT-SUPPLIERS
  console.log('3. PROJECT-SUPPLIERS RELATION:');
  if (supData && supData[0]) {
    const { data: linkData, error: linkError } = await supabase.from('project_suppliers').insert([
      { project_id: projectId, supplier_id: supData[0].id, notes: 'Linking test' }
    ]).select();
    if (linkError) {
      errors.push(`Link Insert: ${linkError.message}`);
    } else {
      // Test nested fetching
      const { data: rel, error: relError } = await supabase.from('projects').select(`
        id,
        project_suppliers (
          id,
          supplier_id,
          suppliers ( name )
        )
      `).eq('id', projectId).single();
      if (relError) {
        errors.push(`Relation Select: ${relError.message}`);
      } else {
        const hasVendor = rel.project_suppliers.some(ps => ps.supplier_id === supData[0].id);
        if (hasVendor) {
          console.log('   ✅ LINK/RENDER PASS');
          report.relations = 'PASS';
        } else {
          errors.push('Relation association not found in nested select');
        }
      }
    }
  }

  // 4. ASSISTANT SCOUTING
  console.log('4. ASSISTANT SCOUTING:');
  const testReport = { project_id: projectId, reported_by: null, scouting_type: 'location', notes: 'Stability Test' };
  const { data: repData, error: repError } = await supabase.from('scouting_reports').insert([testReport]).select();
  if (repError) {
    errors.push(`Scouting Report Insert: ${repError.message}`);
  } else {
    const { data: pData, error: pError } = await supabase.from('scouting_report_photos').insert([
      { scouting_report_id: repData[0].id, file_url: 'https://example.com/test.jpg' }
    ]).select();
    if (pError) {
      errors.push(`Scouting Photo Insert: ${pError.message}`);
    } else {
      const { data: fullRep, error: fullRepError } = await supabase.from('scouting_reports')
        .select('id, scouting_report_photos ( file_url )')
        .eq('id', repData[0].id)
        .single();
      if (fullRepError) {
        errors.push(`Scouting Select: ${fullRepError.message}`);
      } else {
        if (fullRep.scouting_report_photos.length > 0) {
            console.log('   ✅ REPORT/PHOTO PASS');
            report.scouting = 'PASS';
        } else {
            errors.push('Scouting Photo not found in nested select');
        }
      }
    }
  }

  console.log('\n--- VALIDATION SUMMARY ---');
  console.log(JSON.stringify(report, null, 2));
  if (errors.length > 0) {
    console.log('\n--- ERRORS FOUND ---');
    errors.forEach(e => console.log(`- ${e}`));
  }

  // CLEANUP
  console.log('\n--- CLEANING UP ---');
  if (supData && supData[0]) await supabase.from('suppliers').delete().eq('id', supData[0].id);
  if (repData && repData[0]) await supabase.from('scouting_reports').delete().eq('id', repData[0].id);
  if (actData && actData[0]) await supabase.from('project_activity').delete().eq('id', actData[0].id);
  console.log('✅ Cleanup finished.');
}

validateFinal();
