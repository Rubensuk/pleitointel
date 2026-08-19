import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, cargo, mensagem } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('leads')
      .insert([{ nome, email, telefone, cargo, mensagem }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json({ error: 'Erro interno ao processar solicitação' }, { status: 500 });
  }
}