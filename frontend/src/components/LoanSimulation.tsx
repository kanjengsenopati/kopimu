import { useState } from 'react';
import { Text } from './ui/Text';
import { ArrowLeft, PieChart, Calculator, Landmark } from 'lucide-react';

export const LoanSimulation = ({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState(10000000);
  const [tenor, setTenor] = useState(12);
  const interestRate = 12; // 12% per year

  const principalPerMonth = amount / tenor;
  const interestPerMonth = (amount * (interestRate / 100)) / 12;
  const monthlyTotal = principalPerMonth + interestPerMonth;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-10">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
          <ArrowLeft size={20} />
        </button>
        <Text.H2>Simulasi Pinjaman</Text.H2>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Input Card */}
        <section className="card-premium space-y-6">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 mb-2">
              <Landmark size={18} className="text-slate-400" />
              <Text.Label>Jumlah Pinjaman Pokok</Text.Label>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-slate-300">Rp</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-slate-800 text-center tracking-tightest"
              />
            </div>
          </div>

          <div className="w-full">
            <Text.Label className="mb-4 block">Pilih Tenor (Bulan)</Text.Label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenor(t)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all ${tenor === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Real-time Result - CENTER ALIGNED ROW 1, LEFT ALIGNED ROW 2 */}
        <section className="card-premium bg-blue-600 text-white shadow-xl shadow-blue-600/30 border-none">
           <div className="flex justify-center items-center gap-2 mb-4">
             <Calculator size={18} className="text-blue-200" />
             <Text.Label className="text-blue-100">Angsuran Tiap Bulan</Text.Label>
           </div>
           <div className="flex items-baseline gap-1 mb-6">
             <span className="text-2xl font-bold text-blue-300 opacity-60">Rp</span>
             <Text.H1 className="text-white text-[32px] leading-none font-extrabold tracking-tightest">
                {monthlyTotal.toLocaleString('id-ID')}
             </Text.H1>
           </div>

           <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/10">
              <div className="flex flex-col items-start">
                <Text.Label className="text-blue-200">Pokok</Text.Label>
                <Text.Body className="text-white font-bold">{principalPerMonth.toLocaleString('id-ID')}</Text.Body>
              </div>
              <div className="flex flex-col items-start">
                <Text.Label className="text-blue-200">Jasa (12%)</Text.Label>
                <Text.Body className="text-white font-bold">{interestPerMonth.toLocaleString('id-ID')}</Text.Body>
              </div>
           </div>
        </section>

        {/* Info Box */}
        <div className="p-4 bg-emerald-50 rounded-3xl flex flex-col items-center gap-2 text-center border border-emerald-100">
          <PieChart size={20} className="text-emerald-600" />
          <Text.Body className="text-emerald-800 text-xs font-semibold px-4">
            Perhitungan SAK EP Menggunakan Metode Flat Untuk Transparansi Anggota
          </Text.Body>
        </div>

        <button className="btn-primary w-full shadow-lg shadow-blue-600/20">
          Ajukan Sekarang
        </button>
      </div>
    </div>
  );
};
