import React from 'react';
import { Text } from './ui/Text';
import { 
  BarChart3, Users, Settings, Database, 
  Search, ShieldCheck, Download, Plus, Filter, LayoutDashboard, Package, TrendingUp, AlertCircle, Droplets,
  MoreVertical, Edit, Trash2, Mail, Phone, CheckCircle, XCircle, MapPin, Loader2
} from 'lucide-react';
import { SettingsHub } from './SettingsHub';
import { MemberManager } from './MemberManager';
import { SavingManager } from './SavingManager';
import { LendingManager } from './LendingManager';

export const Backoffice = () => {
  const [activeMenu, setActiveMenu] = React.useState('Accounting');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Side Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-white px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">K</div>
          <Text.H2 className="text-white">Kopdar ERP</Text.H2>
        </div>

        <nav className="flex flex-col gap-2">
          <Text.Label className="px-2 mb-2">Main Menu</Text.Label>
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: <BarChart3 /> },
            { id: 'Keanggotaan', label: 'Keanggotaan', icon: <Users /> },
            { id: 'Unit Pinjaman', label: 'Unit Pinjaman', icon: <Database /> },
            { id: 'Unit Retail', icon: <Package />, label: 'Unit Retail' },
            { id: 'Accounting', label: 'Accounting', icon: <ShieldCheck /> },
            { id: 'Settings', label: 'Control Hub', icon: <Settings /> },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5'}`}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeMenu === 'Accounting' ? (
          <AccountingDashboard />
        ) : activeMenu === 'Keanggotaan' ? (
          <MemberManager />
        ) : activeMenu === 'Simpanan' ? (
          <SavingManager />
        ) : activeMenu === 'Unit Pinjaman' ? (
          <LendingManager />
        ) : activeMenu === 'Settings' ? (
          <SettingsHub />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <LayoutDashboard size={48} className="mb-4 opacity-20" />
            <Text.H2>Modul {activeMenu} Sedang Dikembangkan</Text.H2>
          </div>
        )}
      </main>
    </div>
  );
};

const AccountingDashboard = () => (
  <>
    <header className="flex justify-between items-center mb-10">
      <div>
        <Text.H1>Chart of Accounts (COA)</Text.H1>
        <Text.Caption className="not-italic">Standar Akuntansi Keuangan Entitas Privat (SAK EP)</Text.Caption>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            placeholder="Cari akun..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/10"
          />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/10">
          <Plus size={16} /> Tambah Akun
        </button>
      </div>
    </header>

    {/* Accounting Overview Cards - CENTER ROW 1, LEFT ROW 2 */}
    <div className="grid grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Total Aset', amount: '1.450.000.000', change: '+2.1%', color: 'text-blue-600', icon: <TrendingUp size={18} /> },
        { label: 'Total Liabilitas', amount: '820.000.000', change: '-1.5%', color: 'text-red-600', icon: <AlertCircle size={18} /> },
        { label: 'Ekuitas (Modal)', amount: '630.000.000', change: '+5.4%', color: 'text-emerald-600', icon: <Droplets size={18} /> },
      ].map((card, i) => (
        <div key={i} className="card-premium">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className={card.color}>{card.icon}</div>
            <Text.Label className={card.color}>{card.label}</Text.Label>
          </div>
          <div className="flex flex-col items-start w-full">
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${card.color} opacity-60`}>Rp</span>
              <Text.H1 className={`text-[28px] leading-tight ${card.color}`}>{card.amount}</Text.H1>
            </div>
            <div className="mt-4 flex flex-col items-start gap-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.change}
              </span>
              <Text.Caption className="not-italic text-[10px]">Performa Bulan Ini</Text.Caption>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* COA Table */}
    <section className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <Text.H2 className="text-sm tracking-tight text-slate-400">Daftar Akun Perkiraan</Text.H2>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Filter size={18} /></button>
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={18} /></button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-6 py-4"><Text.Label>Kode Akun</Text.Label></th>
            <th className="px-6 py-4"><Text.Label>Nama Akun</Text.Label></th>
            <th className="px-6 py-4"><Text.Label>Kategori</Text.Label></th>
            <th className="px-6 py-4"><Text.Label>Saldo Normal</Text.Label></th>
            <th className="px-6 py-4 text-right"><Text.Label>Total Saldo</Text.Label></th>
          </tr>
        </thead>
        <tbody>
          {[
            { code: '101.01', name: 'Kas Tunai', cat: 'Aset', normal: 'Debit', balance: '45.200.000' },
            { code: '101.02', name: 'Bank Mandiri', cat: 'Aset', normal: 'Debit', balance: '240.800.000' },
            { code: '102.01', name: 'Piutang Pinjaman Anggota', cat: 'Aset', normal: 'Debit', balance: '1.120.000.000' },
            { code: '201.01', name: 'Simpanan Sukarela', cat: 'Liabilitas', normal: 'Kredit', balance: '650.000.000' },
            { code: '301.01', name: 'Modal Pokok', cat: 'Ekuitas', normal: 'Kredit', balance: '480.000.000' },
          ].map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
              <td className="px-6 py-4"><Text.Body className="font-bold text-blue-600">{row.code}</Text.Body></td>
              <td className="px-6 py-4"><Text.Body>{row.name}</Text.Body></td>
              <td className="px-6 py-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${row.cat === 'Aset' ? 'bg-blue-50 text-blue-600' : row.cat === 'Liabilitas' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {row.cat}
                </span>
              </td>
              <td className="px-6 py-4"><Text.Caption className="not-italic">{row.normal}</Text.Caption></td>
              <td className="px-6 py-4 text-right"><Text.Amount className="text-[14px]">{row.balance}</Text.Amount></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </>
);
