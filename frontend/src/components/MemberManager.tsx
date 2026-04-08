import { useState, useEffect } from 'react';
import { Text } from './ui/Text';
import { 
  Users, UserPlus, Search, Filter, Download, 
  CheckCircle, MapPin, Loader2, Phone, Edit, Trash2, MoreVertical
} from 'lucide-react';
import axios from 'axios';

interface Member {
  id: string;
  nik: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  status: string;
  createdAt: string;
  _count: {
    loans: number;
    savings: number;
  };
}

export const MemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ nik: '', nama: '', alamat: '', telepon: '' });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/members');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/members', newMember);
      setShowAddForm(false);
      setNewMember({ nik: '', nama: '', alamat: '', telepon: '' });
      fetchMembers();
    } catch (err) {
      alert('Gagal menambah anggota');
    }
  };

  const stats = [
    { label: 'Total Anggota', value: members.length, icon: <Users size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Anggota Aktif', value: members.filter(m => m.status === 'AKTIF').length, icon: <CheckCircle size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Calon Anggota', value: members.filter(m => m.status === 'PENDING').length, icon: <Loader2 size={16} />, color: 'text-slate-400', bg: 'bg-slate-50' },
  ];

  const filteredMembers = members.filter(m => 
    m.nama.toLowerCase().includes(search.toLowerCase()) || 
    m.nik.includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <Text.H1>Master Keanggotaan</Text.H1>
          <Text.Caption className="not-italic">Kelola database anggota, iuran, dan status kepesertaan.</Text.Caption>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Cari NIK atau Nama..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/10 w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2 px-4 py-2.5"
          >
            <UserPlus size={18} /> {showAddForm ? 'Batalkan' : 'Tambah Anggota'}
          </button>
        </div>
      </header>

      {/* Stats Cards - Global Refined Style */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="card-premium p-4 flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-3">
               <Text.Label className="text-slate-400 font-bold tracking-[2px]">{s.label}</Text.Label>
               <div className={`p-2 rounded-xl scale-90 ${s.bg} ${s.color}`}>
                  {s.icon}
               </div>
            </div>
            <Text.H1 className={`text-2xl font-bold text-center ${s.color}`}>{s.value}</Text.H1>
          </div>
        ))}
      </div>

      {/* Inline Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddMember} className="card-premium p-6 border-blue-100 bg-blue-50/10 animate-in zoom-in-95 duration-300">
           <div className="flex justify-between items-center mb-6">
              <Text.H2>Pendaftaran Anggota Baru</Text.H2>
              <Text.Caption className="not-italic text-blue-600 font-bold uppercase tracking-widest text-[10px]">Data Wajib Diisi</Text.Caption>
           </div>
           <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1.5">
                 <Text.Label>NIK (16 Digit)</Text.Label>
                 <input 
                   required
                   value={newMember.nik}
                   onChange={e => setNewMember({...newMember, nik: e.target.value})}
                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                 />
              </div>
              <div className="space-y-1.5">
                 <Text.Label>Nama Lengkap</Text.Label>
                 <input 
                   required
                   value={newMember.nama}
                   onChange={e => setNewMember({...newMember, nama: e.target.value})}
                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                 />
              </div>
              <div className="space-y-1.5">
                 <Text.Label>Nomor Telepon</Text.Label>
                 <input 
                   value={newMember.telepon}
                   onChange={e => setNewMember({...newMember, telepon: e.target.value})}
                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/10 text-sm"
                 />
              </div>
              <div className="space-y-1.5 flex flex-col justify-end">
                 <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all text-sm">
                    Simpan Anggota
                 </button>
              </div>
           </div>
        </form>
      )}

      {/* Main Table */}
      <section className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <Text.H2 className="text-sm tracking-tight text-slate-400 font-bold uppercase">Database Terpusat</Text.H2>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Filter size={18} /></button>
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4"><Text.Label>Anggota</Text.Label></th>
                <th className="px-6 py-4"><Text.Label>Kontak & Alamat</Text.Label></th>
                <th className="px-6 py-4 text-center"><Text.Label>Status</Text.Label></th>
                <th className="px-6 py-4 text-center"><Text.Label>Produk</Text.Label></th>
                <th className="px-6 py-4 text-right"><Text.Label>Aksi</Text.Label></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin inline-block text-blue-600 mb-2" size={32} />
                    <Text.Caption className="not-italic block">Memuat data anggota...</Text.Caption>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Users className="inline-block text-slate-200 mb-4" size={48} />
                    <Text.H2 className="text-slate-400">Tidak ada anggota ditemukan</Text.H2>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {member.nama.charAt(0)}
                        </div>
                        <div>
                          <Text.Body className="font-bold">{member.nama}</Text.Body>
                          <Text.Caption className="not-italic text-[10px] font-bold tracking-widest text-slate-400 uppercase leading-none mt-0.5">{member.nik}</Text.Caption>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <Phone size={12} className="text-slate-400" /> {member.telepon || '-'}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                          <MapPin size={12} /> {member.alamat || 'Alamat belum diatur'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${member.status === 'AKTIF' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <div className="flex flex-col items-center">
                          <Text.Label className="text-[9px]">Pinjam</Text.Label>
                          <Text.Body className="font-bold text-blue-600">{member._count.loans}</Text.Body>
                        </div>
                        <div className="w-px h-8 bg-slate-100 mx-2" />
                        <div className="flex flex-col items-center">
                          <Text.Label className="text-[9px]">Simpan</Text.Label>
                          <Text.Body className="font-bold text-emerald-600">{member._count.savings}</Text.Body>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-slate-400 hover:bg-white hover:text-blue-600 rounded-lg transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:bg-white hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:bg-white hover:text-slate-900 rounded-lg transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                          <MoreVertical size={16} />
                        </button>
                      </div>
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
