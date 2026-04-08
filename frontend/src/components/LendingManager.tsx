import React, { useState, useEffect } from 'react';
import { Text } from './ui/Text';
import { 
  Database, FileText, Search, Filter, Download, 
  Clock, CheckCircle, AlertCircle, TrendingUp,
  Plus, MoreVertical, ExternalLink, Loader2
} from 'lucide-react';
import axios from 'axios';

interface Loan {
  id: string;
  member: {
    nama: string;
    nik: string;
  };
  product: {
    name: string;
  };
  amount: number;
  tenor: number;
  interestRate: number;
  status: string;
  createdAt: string;
}

export const LendingManager = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab ] = useState<'all' | 'pending' | 'active'>('all');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lending/loans');
      setLoans(res.data);
    } catch (err) {
      console.error('Failed to fetch loans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(Number(val));
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Pencairan dana akan mendebit Kas dan membuat jadwal angsuran. Lanjutkan?')) return;
    try {
      await axios.put(`/api/lending/loans/${id}/approve`);
      alert('Pinjaman berhasil dicairkan!');
      fetchLoans();
    } catch (err) {
      alert('Gagal mencairkan pinjaman');
    }
  };

  const filteredLoans = loans.filter(l => {
    const matchesSearch = l.member.nama.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search);
    const matchesTab = activeTab === 'all' || (activeTab === 'pending' && l.status === 'PENDING') || (activeTab === 'active' && l.status === 'APPROVED');
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: 'Menunggu Persetujuan', value: loans.filter(l => l.status === 'PENDING').length, color: 'text-amber-600', icon: <Clock size={18} /> },
    { label: 'Pinjaman Aktif', value: loans.filter(l => l.status === 'APPROVED').length, color: 'text-blue-600', icon: <TrendingUp size={18} /> },
    { label: 'Selesai (Lunas)', value: loans.filter(l => l.status === 'PAID').length, color: 'text-emerald-600', icon: <CheckCircle size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <Text.H1>Manajemen Pinjaman</Text.H1>
          <Text.Caption className="not-italic">Persetujuan pengajuan, pencairan dana, dan monitoring piutang anggota.</Text.Caption>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Cari nama anggota..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/10 w-64"
            />
          </div>
          <button className="btn-primary flex items-center gap-2 px-4 py-2.5">
            <Plus size={18} /> Pengajuan Baru
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="card-premium flex items-center gap-4">
             <div className={`p-3 rounded-xl bg-slate-50 ${s.color}`}>
                {s.icon}
             </div>
             <div>
                <Text.Label className="text-slate-400 uppercase tracking-widest">{s.label}</Text.Label>
                <div className="text-2xl font-bold text-slate-900 mt-1">{s.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-100 pb-px">
        {[
          { id: 'all', label: 'Semua Ajuan' },
          { id: 'pending', label: 'Menunggu Approval' },
          { id: 'active', label: 'Sedang Berjalan' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <section className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Debitur</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Detail Pinjaman</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center"><Loader2 className="animate-spin inline-block text-blue-600" /></td>
              </tr>
            ) : filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400">Tidak ada pengajuan ditemukan.</td>
              </tr>
            ) : (
              filteredLoans.map(loan => (
                <tr key={loan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                        {loan.member.nama.charAt(0)}
                      </div>
                      <div>
                        <Text.Body className="font-bold">{loan.member.nama}</Text.Body>
                        <Text.Caption className="not-italic text-[10px] text-slate-400 uppercase font-bold">{loan.member.nik}</Text.Caption>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <Text.Amount className="text-blue-600">Rp {formatIDR(loan.amount)}</Text.Amount>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                         {loan.product.name} • {loan.tenor} Bulan • {loan.interestRate}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                      loan.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      loan.status === 'APPROVED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                       {loan.status === 'PENDING' ? (
                          <button 
                            onClick={() => handleApprove(loan.id)}
                            className="bg-emerald-600 text-white p-2 rounded-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all font-bold text-[10px] flex items-center gap-1"
                          >
                             Cairkan Dana
                          </button>
                       ) : (
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                             <ExternalLink size={16} />
                          </button>
                       )}
                       <button className="p-2 text-slate-400">
                         <MoreVertical size={18} />
                       </button>
                     </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};
