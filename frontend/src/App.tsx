import { useState, cloneElement } from 'react';
import type { ReactElement } from 'react';
import { Text } from './components/ui/Text';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Building2, ShoppingBag, Factory, 
  Bell, User as UserIcon, Home, History, Settings, LayoutDashboard, 
  SwitchCamera, CreditCard
} from 'lucide-react';
import { LoanSimulation } from './components/LoanSimulation';
import { PengurusKPI } from './components/PengurusKPI';
import { Backoffice } from './components/Backoffice';

type ViewState = 'member-dashboard' | 'simulation' | 'pengurus-kpi' | 'backoffice';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('member-dashboard');
  const [role, setRole] = useState<'ANGGOTA' | 'PENGURUS'>('ANGGOTA');

  // Handle Navigation
  if (currentView === 'simulation') {
    return <LoanSimulation onBack={() => setCurrentView(role === 'ANGGOTA' ? 'member-dashboard' : 'pengurus-kpi')} />;
  }

  if (currentView === 'pengurus-kpi') {
    return <PengurusKPI onBack={() => setCurrentView('member-dashboard')} />;
  }

  if (currentView === 'backoffice') {
    return <div className="min-h-screen bg-slate-50"><Backoffice /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 transition-all duration-300">
      {/* Role Switcher (For Demo Purposes) */}
      <div className="bg-slate-900 text-white px-5 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span>Current Role: {role}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentView('backoffice')}
            className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
          >
            Go to Admin Backoffice
          </button>
          <button 
            onClick={() => {
              const nextRole = role === 'ANGGOTA' ? 'PENGURUS' : 'ANGGOTA';
              setRole(nextRole);
              if (nextRole === 'PENGURUS') setCurrentView('pengurus-kpi');
              else setCurrentView('member-dashboard');
            }}
            className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded"
          >
            <SwitchCamera size={10} /> Switch Role
          </button>
        </div>
      </div>

      {/* Glass Sticky Header */}
      <header className="glass-header">
        <div className="flex flex-col">
          <Text.Caption>Selamat Datang,</Text.Caption>
          <Text.H1>{role === 'ANGGOTA' ? 'Budi Santoso' : 'Admin KSU'}</Text.H1>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-400 relative">
            <Bell size={20} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <UserIcon size={20} />
          </div>
        </div>
      </header>

      <main className="px-5 mt-6 space-y-8">
        {/* Main Balance Card - CENTER ALIGNED */}
        <section className="card-premium bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-600/20">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Wallet size={18} className="text-blue-200" />
            <Text.Label className="text-blue-100">Total Simpanan</Text.Label>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-300 opacity-60">Rp</span>
            <Text.H1 className="text-white text-[32px] leading-none mb-4">4.250.000</Text.H1>
          </div>
          
          <div className="w-fit flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg mt-2">
            <ArrowUpRight size={14} className="text-emerald-300" />
            <Text.Caption className="text-blue-50 text-[11px] not-italic">Bertumbuh 12.5% Bulan Ini</Text.Caption>
          </div>
          <Text.Caption className="text-blue-200 mt-6 opacity-50">Member ID: AN-00284</Text.Caption>
        </section>

        {/* Action Grid (Z-Layout for KSU Units) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <Text.H2>Unit Bisnis</Text.H2>
            <Text.Caption className="text-blue-600 font-bold not-italic">Lihat Semua</Text.Caption>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Simpan Pinjam', icon: <Building2 />, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Retail Mart', icon: <ShoppingBag />, color: 'bg-blue-50 text-blue-600' },
              { label: 'Manufaktur', icon: <Factory />, color: 'bg-orange-50 text-orange-600' },
              { label: 'Dashboard', icon: <LayoutDashboard />, color: 'bg-slate-50 text-slate-600', roleOnly: 'PENGURUS' },
            ].map((item, i) => (
              (!item.roleOnly || (item.roleOnly === role)) && (
                <div 
                  key={i} 
                  className="flex flex-col items-center gap-2 active:scale-90 transition-transform cursor-pointer"
                  onClick={() => item.label === 'Dashboard' && setCurrentView('pengurus-kpi')}
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-sm border border-black/[0.02]`}>
                    {cloneElement(item.icon as ReactElement<any>, { size: 24 })}
                  </div>
                  <Text.Label className="text-[10px] text-center leading-tight whitespace-nowrap">{item.label}</Text.Label>
                </div>
              )
            ))}
          </div>
        </section>

        {/* Loan Section - CENTER ALIGNED */}
        <section className="card-premium border border-slate-100">
          <div className="flex justify-center items-center gap-2 mb-4">
            <CreditCard size={18} className="text-slate-400" />
            <Text.Label>Kredit Modal Kerja</Text.Label>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-300">Rp</span>
            <Text.H1 className="text-[28px] leading-tight mb-2">12.000.000</Text.H1>
          </div>
          <div className="badge-success w-fit mb-6">Terverifikasi</div>
          
          <div className="flex flex-col gap-4 w-full pt-6 border-t border-slate-50">
            <Text.Caption className="not-italic font-medium text-slate-500">Sisa 8 dari 12 Angsuran</Text.Caption>
            <button 
              onClick={() => setCurrentView('simulation')}
              className="w-full py-3.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-2xl active:scale-95 transition-all"
            >
              Cek Simulasi Baru
            </button>
          </div>
        </section>

        {/* Recent Transactions - Left Aligned inside layout but cleaned up */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Text.H2>Aktivitas Terakhir</Text.H2>
            <Text.Label className="text-blue-600">Terbaru</Text.Label>
          </div>
          {[
            { title: "Belanja Mart KSU", date: "Tadi Siang, 14:20", amount: "45.000", type: "out" },
            { title: "Simpanan Wajib", date: "Kemarin, 09:00", amount: "150.000", type: "in" },
            { title: "Bagi Hasil (SHU)", date: "2 Apr 2026", amount: "850.000", type: "in" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-3xl bg-white border border-slate-50 shadow-sm shadow-slate-200/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${item.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {item.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="flex flex-col">
                  <Text.Body className="font-bold text-slate-800">{item.title}</Text.Body>
                  <Text.Caption className="not-italic text-slate-400">{item.date}</Text.Caption>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Text.Amount className={item.type === 'in' ? 'text-emerald-600' : 'text-red-600'}>
                  {item.type === 'in' ? '+' : '-'} {item.amount}
                </Text.Amount>
                <Text.Caption className="not-italic text-[10px]">Sukses</Text.Caption>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Glass Bottom Navigation */}
      <nav className="glass-nav">
        {[
          { label: 'Beranda', icon: <Home /> },
          { label: 'Riwayat', icon: <History /> },
          { label: 'Aksi', icon: role === 'ANGGOTA' ? <ShoppingBag /> : <LayoutDashboard />, action: true },
          { label: 'Profil', icon: <Settings /> },
        ].map((item, i) => (
          <div 
            key={i} 
            className={`flex flex-col items-center gap-1.5 ${item.action ? 'text-blue-600' : 'text-slate-400'}`}
            onClick={() => {
              if (item.label === 'Aksi' && role === 'PENGURUS') setCurrentView('pengurus-kpi');
            }}
          >
            <div className={`p-1 ${item.action ? 'bg-blue-50 rounded-xl px-4 py-2 mt-[-4px]' : ''}`}>
              {cloneElement(item.icon as ReactElement<any>, { size: 24, strokeWidth: item.action ? 2.5 : 2 })}
            </div>
            <Text.Label className={`text-[9px] ${item.action ? 'text-blue-600 font-bold' : ''}`}>{item.label}</Text.Label>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default App;
