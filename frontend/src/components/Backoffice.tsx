import React from 'react';
import { Text } from './ui/Text';
import { 
  BarChart3, Users, Settings, 
  Search, ShieldCheck, Download, Plus, Filter, LayoutDashboard, Package, TrendingUp, AlertCircle, Droplets,
  ChevronDown, User as UserIcon, Bell
} from 'lucide-react';
import { SettingsHub } from './SettingsHub';
import { MemberManager } from './MemberManager';
import { SavingManager } from './SavingManager';
import { LendingManager } from './LendingManager';

export const Backoffice = () => {
  const [activeMenu, setActiveMenu] = React.useState('Accounting');

  const navGroups = [
    { id: 'Dashboard', label: 'Dashboard', icon: <BarChart3 /> },
    { 
      label: 'Koperasi', 
      icon: <Users />,
      items: [
        { id: 'Keanggotaan', label: 'Master Anggota' },
        { id: 'Simpanan', label: 'Unit Simpanan' },
        { id: 'Unit Pinjaman', label: 'Unit Pinjaman' }
      ]
    },
    { id: 'Unit Retail', label: 'Unit Retail', icon: <Package /> },
    { 
      label: 'Finance', 
      icon: <ShieldCheck />,
      items: [
        { id: 'Accounting', label: 'Accounting (SAK EP)' },
        { id: 'Jurnal Umum', label: 'Jurnal Umum' }
      ]
    },
    { id: 'Settings', label: 'Control Hub', icon: <Settings /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Sticky Topbar Navigation */}
      <header className="sticky top-0 z-50 h-18 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-10">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">K</div>
            <div className="flex flex-col">
                <Text.H2 className="text-slate-900 text-sm font-black leading-none uppercase tracking-tighter">KOPIMU</Text.H2>
                <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">Backoffice</span>
            </div>
          </div>

          {/* Grouped Navigation */}
          <nav className="flex items-center gap-1 h-full">
            {navGroups.map((group, i) => (
              <div key={i} className="relative group h-full flex items-center">
                {group.items ? (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-all rounded-xl hover:bg-slate-100/50">
                      {React.cloneElement(group.icon as React.ReactElement<any>, { size: 18 })}
                      {group.label}
                      <ChevronDown size={14} className="opacity-40 group-hover:rotate-180 transition-transform" />
                    </button>
                    {/* Dropdown Menu (Hover Triggered) */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[24px] shadow-2xl p-3 min-w-[200px]">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeMenu === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => setActiveMenu(group.id!)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${activeMenu === group.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'}`}
                  >
                    {group.icon && React.cloneElement(group.icon as React.ReactElement<any>, { size: 18 })}
                    {group.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/50 border border-slate-100 rounded-2xl">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm">
                    <Search size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all relative">
                    <Bell size={18} />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                </button>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end text-right">
                    <Text.Label className="text-slate-900 leading-none">Admin KSU</Text.Label>
                    <Text.Caption className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">Super Admin</Text.Caption>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
                    <UserIcon size={20} />
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area - Full Width */}
      <main className="flex-1 p-8 lg:px-12 xl:px-20 max-w-screen-2xl mx-auto w-full">
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

    {/* Accounting Overview Cards - Dense & Compact */}
    <div className="grid grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Total Aset', amount: '1.450.000.000', change: '+2.1%', color: 'text-blue-600', icon: <TrendingUp size={16} />, bg: 'bg-blue-50' },
        { label: 'Liabilitas', amount: '820.000.000', change: '-1.5%', color: 'text-red-600', icon: <AlertCircle size={16} />, bg: 'bg-red-50' },
        { label: 'Ekuitas', amount: '630.000.000', change: '+5.4%', color: 'text-emerald-600', icon: <Droplets size={16} />, bg: 'bg-emerald-50' },
      ].map((card, i) => (
        <div key={i} className="card-premium p-4 flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-4">
             <Text.Label className="text-slate-400 font-bold tracking-[2px]">{card.label}</Text.Label>
             <div className={`p-2 rounded-xl scale-90 ${card.bg} ${card.color}`}>
                {card.icon}
             </div>
          </div>
          
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-bold opacity-30 ${card.color}`}>Rp</span>
            <Text.H1 className={`text-[26px] leading-tight ${card.color}`}>{card.amount}</Text.H1>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${card.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {card.change}
            </span>
            <Text.Caption className="not-italic text-[9px] uppercase tracking-wider font-bold">MoM Growth</Text.Caption>
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
