const supabase = require('../config/db');

class QrCode {
  static async findByUrl(qrUrl) {
    // 1. Get QR code basics
    const { data: qr, error: qrErr } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('code_value', qrUrl)
      .single();
    
    if (qrErr || !qr) return null;

    // 2. Get Branch info separately to ensure database reliability
    const { data: branch, error: brErr } = await supabase
      .from('branches')
      .select('name, address')
      .eq('branch_id', qr.branch_id)
      .single();

    return {
      qr_id: qr.qr_code_id,
      qr_code_value: qr.code_value,
      branch_id: qr.branch_id,
      branch_name: branch ? branch.name : 'Unknown Branch',
      location: branch ? branch.address : 'Location Not Specified',
    };
  }
  static async findAll() {
    const { data, error } = await supabase.from('qr_codes').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  }
  static async create(data) {
    const { qr_code_value, branch_id, service_id, organization_id, description } = data;
    const insert = { code_value: qr_code_value, branch_id };
    if (service_id) insert.service_id = service_id;
    if (organization_id) insert.organization_id = organization_id;
    if (description) insert.description = description;
    const { data: qr, error } = await supabase.from('qr_codes').insert([insert]).select().single();
    if (error) throw new Error(error.message);
    return qr;
  }
}
module.exports = QrCode;
