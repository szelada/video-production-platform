import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getGeminiModel, SCRIP_ANALYSIS_PROMPT } from '@/lib/gemini';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Backend client with service role to bypass RLS for AI processing
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { projectId, materialId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        needs_setup: true,
        message: 'GEMINI_API_KEY no configurada en .env.local' 
      }, { status: 200 });
    }

    // 1. Fetch Material details and content
    let scriptText = "";
    let fileName = "Script";

    if (materialId) {
       const { data: material } = await supabaseAdmin
         .from('project_materials')
         .select('*')
         .eq('id', materialId)
         .single();
       
       if (material) {
         fileName = material.file_name;
         
         // DOWNLOAD FROM STORAGE
         const storagePath = material.file_url.split('/storage/v1/object/public/')[1];
         if (storagePath) {
            const bucket = storagePath.split('/')[0];
            const path = storagePath.split('/').slice(1).join('/');
            
            const { data: fileData, error: downloadError } = await supabaseAdmin
              .storage
              .from(bucket)
              .download(path);

            if (!downloadError && fileData) {
              scriptText = await fileData.text();
            }
         }
       }
    }

    if (!scriptText) {
      return NextResponse.json({ error: 'No se pudo leer el contenido del guion' }, { status: 400 });
    }

    console.log(`[AI] Analyzing real script content: ${fileName} (${scriptText.length} chars)`);

    // 2. Call Gemini with Fallback Logic (Updated for 2026 environment)
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-pro"];
    let lastError = null;
    let text = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI] Trying model: ${modelName}...`);
        const model = getGeminiModel(modelName);
        const fullPrompt = `${SCRIP_ANALYSIS_PROMPT}\n\n${scriptText}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        text = response.text();
        
        if (text) {
          console.log(`[AI] Success with model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[AI] Model ${modelName} failed:`, err.message);
        lastError = err;
        continue;
      }
    }

    if (!text) {
      throw lastError || new Error("No se pudo obtener respuesta de ningún modelo de IA");
    }
    
    // Clean JSON from potential markdown blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", text);
      throw new Error("La IA devolvió un formato no válido. Inténtalo de nuevo.");
    }

    const extractedItems = (parsed.items || []).map((item: any) => ({
      ...item,
      project_id: projectId,
      is_ai_generated: true,
      status: 'pending'
    }));

    // 3. Persist results
    await supabaseAdmin
      .from('project_breakdown_items')
      .delete()
      .eq('project_id', projectId)
      .eq('is_ai_generated', true);

    const { data: savedItems, error: saveError } = await supabaseAdmin
      .from('project_breakdown_items')
      .insert(extractedItems)
      .select();

    if (saveError) throw saveError;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Desglose real completado',
      itemsCount: savedItems?.length || 0,
      data: savedItems 
    });

  } catch (error: any) {
    console.error('[AI API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
