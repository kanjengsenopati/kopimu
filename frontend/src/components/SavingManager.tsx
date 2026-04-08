import React, { useState, useEffect } from 'react';
import { Text } from './ui/Text';
import { 
  Database, Plus, Search, Filter, Download, 
  ArrowUpRight, ArrowDownLeft, Wallet, Calendar,
  Loader2, MoreHorizontal
} from 'lucide-react';
import axios from 'axios';

interface SavingEntry {
  id: string;
  memberId: string;
  type: string;
  amount: number;
  date: string;
  member: {
    nama: string;
  };
}

export const SavingManager = () => {
  const [entries, setEntries] = useState<SavingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/savings');
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch savings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const totalPokok = entries.filter(e => e.type === 'POKOK').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalWajib = entries.filter(e => e.type === 'WAJIB').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSukarela = entries.filter(e => e.type === 'SUKARELA').reduce((sum, e) => sum + Number(e.amount), 0);

  const stats = [
    { label: 'Simp. Pokok', value: totalPokok, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Simp. Wajib', value: totalWajib, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Simp. Sukarela', value: totalSukarela, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const filteredEntries = entries.filter(e => 
    e.member.nama.toLowerCase().includes(search.toLowerCase()) || 
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <Text.H1>Modul Simpanan</Text.H1>
          <Text.Caption className="not-italic">Pencatatan setoran simpanan pokok, wajib, dan sukarela anggota.</Text.Caption>
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
            <Plus size={18} /> Catat Setoran
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="card-premium">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                <Wallet size={20} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 uppercase tracking-widest border border-slate-100">
                Summary
              </span>
            </div>
            <Text.Label className="text-slate-400">{s.label}</Text.Label>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-sm font-bold opacity-40 ${s.color}`}>Rp</span>
              <Text.Amount className={`text-2xl ${s.color}`}>{formatIDR(s.value)}</Text.Amount>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <section className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <Text.H2 className="text-sm tracking-tight text-slate-400 font-bold uppercase">Log Transaksi Terakhir</Text.H2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Filter size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4"><Text.Label>Tanggal</Text.Label></th>
                <th className="px-6 py-4"><Text.Label>Anggota</Text.Label></th>
                <th className="px-6 py-4 text-center"><Text.Label>Jenis</Text.Label></th>
                <th className="px-6 py-4 text-right"><Text.Label>Nominal Setoran</Text.Label></th>
                <th className="px-6 py-4 text-right"><Text.Label>Aksi</Text.Label></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin inline-block text-blue-600 mb-2" size={32} />
                    <Text.Caption className="not-italic block">Memuat data simpanan...</Text.Caption>
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Database className="inline-block text-slate-200 mb-4" size={48} />
                    <Text.H2 className="text-slate-400">Tidak ada riwayat setoran</Text.H2>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Calendar size={16} />
                        </div>
                        <Text.Caption className="not-italic font-bold text-slate-600">
                          {new Date(entry.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text.Caption>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center font-bold text-blue-600 text-xs">
                          {entry.member.nama.charAt(0)}
                        </div>
                        <Text.Body className="font-bold">{entry.member.nama}</Text.Body>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        entry.type === 'POKOK' ? 'bg-blue-50 text-blue-600' : 
                        entry.type === 'WAJIB' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold">
                        <ArrowDownLeft size={14} className="opacity-50" />
                        <Text.Amount className="text-[14px]">
                          {formatIDR(Number(entry.amount))}
                        </Text.Amount>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">
                       <button className="p-2 hover:text-slate-900 transition-colors">
                         <MoreHorizontal size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
