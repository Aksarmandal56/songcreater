import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*, packages(name, price, delivery_hours)')
        .order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const {
        order_code,
        customer_name,
        customer_email,
        customer_phone,
        package_id,
        status,
        delivery_date,
        story,
        music_style,
        singer_voice,
        mood,
        language,
        special_message,
        reference_song,
      } = req.body;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_code,
          customer_name,
          customer_email,
          customer_phone,
          package_id,
          status,
          delivery_date,
          story,
          music_style,
          singer_voice,
          mood,
          language,
          special_message,
          reference_song,
        })
        .select('*, packages(name, price, delivery_hours)')
        .single();
      if (error) throw error;

      const statusSteps = [
        { step: 'Received', completed: true },
        { step: 'Lyrics Writing', completed: false },
        { step: 'Music Production', completed: false },
        { step: 'Mixing', completed: false },
        { step: 'Ready', completed: false },
      ];
      const { error: statusError } = await supabase
        .from('order_statuses')
        .insert(statusSteps.map((item) => ({
          order_id: data.id,
          step: item.step,
          completed: item.completed,
          timestamp: new Date().toISOString(),
        })));
      if (statusError) throw statusError;

      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, status, delivery_date, assigned_producer } = req.body;
      const { data, error } = await supabase
        .from('orders')
        .update({ status, delivery_date, assigned_producer })
        .eq('id', id)
        .select('*, packages(name, price, delivery_hours)')
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
