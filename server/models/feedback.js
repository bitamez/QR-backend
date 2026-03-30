const supabase = require('../config/db');

class Feedback {
  static async countAndAvg() {
    const { data, count, error } = await supabase
      .from('feedbacks')
      .select('rating', { count: 'exact' });
    
    if (error) throw new Error(error.message);

    const ratings = data || [];
    const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = ratings.length > 0 ? (total / ratings.length).toFixed(1) : "0.0";
    
    return {
      count: count || 0,
      avg: avg
    };
  }

  static async findTrend() {
    const { data, error } = await supabase.from('feedbacks').select('created_at');
    if (error) throw new Error(error.message);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = {};
    
    data.forEach(f => {
      const d = new Date(f.created_at);
      const m = months[d.getMonth()];
      counts[m] = (counts[m] || 0) + 1;
    });

    const trend = months.map(m => ({ name: m, value: counts[m] || 0 }));
    return trend.filter(t => t.value > 0).slice(-6);
  }

  static async getBranchStats(branch_id) {
    const { data: qrs, error: qrErr } = await supabase.from('qr_codes').select('qr_code_id').eq('branch_id', branch_id);
    if (qrErr) throw new Error(qrErr.message);

    const qrIds = qrs.map(q => q.qr_code_id);
    if (qrIds.length === 0) return { count: 0, avg: "0.0" };

    const { data, error } = await supabase.from('feedbacks').select('rating').in('qr_code_id', qrIds);
    if (error) throw new Error(error.message);

    const total = data.reduce((sum, r) => sum + (r.rating || 0), 0);
    const avg = data.length > 0 ? (total / data.length).toFixed(1) : "0.0";
    
    return {
      count: data.length,
      avg: avg
    };
  }

  static async getBranchRecent(branch_id) {
    const { data: qrs, error: qrErr } = await supabase.from('qr_codes').select('qr_code_id').eq('branch_id', branch_id);
    if (qrErr) throw new Error(qrErr.message);

    const qrIds = qrs.map(q => q.qr_code_id);
    if (qrIds.length === 0) return [];

    const { data, error } = await supabase
      .from('feedbacks')
      .select('created_at, customer_name, rating, comment')
      .in('qr_code_id', qrIds)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw new Error(error.message);
    
    return data.map(f => ({
      date: new Date(f.created_at).toLocaleDateString(),
      customer: f.customer_name || 'Anonymous',
      rating: f.rating,
      comment: f.comment
    }));
  }

  static async create(data) {
    const { qr_id, rating, comments, user_name, user_email, user_phone, device_hash } = data;
    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .insert([{ 
        qr_code_id: qr_id, 
        rating, 
        comment: comments, 
        customer_name: user_name,
        customer_email: user_email,
        customer_phone: user_phone,
        device_hash 
      }])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return feedback;
  }

  static async getDetailedReports() {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        created_at,
        rating,
        comment,
        qr_codes:qr_code_id (
          branches:branch_id (
            name
          ),
          services:service_id (
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw new Error(error.message);

    return data.map(f => ({
      date: new Date(f.created_at).toLocaleDateString(),
      branch: f.qr_codes?.branches?.name || 'Unknown',
      service: f.qr_codes?.services?.name || 'All',
      rating: f.rating,
      comment: f.comment
    }));
  }

  static async getRatingDistribution() {
    const { data, error } = await supabase.from('feedbacks').select('rating');
    if (error) throw new Error(error.message);

    const counts = {};
    (data || []).forEach(f => {
      counts[f.rating] = (counts[f.rating] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name,
      value: value
    })).sort((a, b) => b.name - a.name);
  }
}
module.exports = Feedback;
