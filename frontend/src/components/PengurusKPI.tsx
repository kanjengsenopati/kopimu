import { Text } from './ui/Text';
import { ArrowLeft, TrendingUp, AlertCircle, Droplets, Users, ArrowRight } from 'lucide-react';

export const PengurusKPI = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <Text.H2>KPI Manajemen</Text.H2>
        </div>
        <div className="badge-success bg-blue-50 text-blue-600">Global View</div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* KPI Grid - [ICON] [TITLE] vs [VALUE] CENTERED ROW 1, LEFT ROW 2 */}
        <section className="grid grid-cols-2 gap-4">
          <div className="card-premium">
            <div className="flex justify-center items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-red-500" />
              <Text.Label className="text-red-600">NPL (Macet)</Text.Label>
            </div>
            <div className="flex flex-col items-start w-full">
              <Text.H1 className="text-red-600 text-[28px] mb-1">2.4%</Text.H1>
              <Text.Caption className="not-italic text-emerald-600 font-bold">Sehat (Batas 5%)</Text.Caption>
            </div>
          </div>

          <div className="card-premium">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Droplets size={18} className="text-blue-500" />
              <Text.Label className="text-blue-600">Likuiditas</Text.Label>
            </div>
            <div className="flex flex-col items-start w-full">
              <Text.H1 className="text-blue-600 text-[28px] mb-1">18.5%</Text.H1>
              <Text.Caption className="not-italic text-slate-400">Kas Tersedia</Text.Caption>
            </div>
          </div>
        </section>

        {/* Growth Chart - CENTER REFACTORED */}
        <section className="card-premium">
          <div className="flex justify-center items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-emerald-600" />
            <Text.Label className="text-slate-800">Pertumbuhan Aset</Text.Label>
          </div>
          
          <div className="flex flex-col items-start w-full mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-300">Rp</span>
              <Text.H1 className="text-[32px] mb-2">1.280.000.000</Text.H1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
               <TrendingUp size={14} />
               <span className="text-xs font-bold">+8.2% Tahun Ini</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-32 gap-2 w-full px-2">
            {[40, 55, 45, 70, 65, 85, 95].map((h, i) => (
              <div 
                key={i} 
                style={{ height: `${h}%` }} 
                className={`w-full rounded-t-xl transition-all duration-500 ${i === 6 ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-blue-100'}`}
              />
            ))}
          </div>
        </section>
Line 64: 

        {/* Action Required */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Text.H2>Persetujuan Tertunda</Text.H2>
            <Text.Label className="text-blue-600 font-bold">12 Total</Text.Label>
          </div>

          {[
            { name: "Siti Aminah", type: "Modal Usaha", amount: "15.000.000", date: "2 Jam Lalu" },
            { name: "Budi Jaya", type: "Pinjaman Kilat", amount: "2.500.000", date: "5 Jam Lalu" },
            { name: "CV. Makmur", type: "Invoice Factoring", amount: "45.000.000", date: "1 Hari Lalu" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-3xl bg-white border border-slate-50 shadow-sm shadow-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Users size={20} />
                </div>
                <div className="flex flex-col">
                  <Text.Body className="font-bold text-slate-800">{item.name}</Text.Body>
                  <Text.Caption className="not-italic text-slate-400">{item.type} • {item.date}</Text.Caption>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Text.Amount className="text-[14px] text-blue-600 font-extrabold">{item.amount}</Text.Amount>
                <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                  Review <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
