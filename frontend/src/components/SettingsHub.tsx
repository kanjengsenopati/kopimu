import { useState, useEffect } from 'react';
import { Text } from './ui/Text';
import { Shield, Percent, Save, Globe, User, Loader2 } from 'lucide-react';
import { settingsService } from '../services/settings.service';
import type { Role, Permission, SHUConfig } from '../services/settings.service';

export const SettingsHub = () => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'shu' | 'profile'>('rbac');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Sub-navigation */}
      <div className="flex gap-4 border-b border-slate-200 pb-px">
        {[
          { id: 'rbac', label: 'RBAC Matrix', icon: <Shield size={16} /> },
          { id: 'shu', label: 'Formula SHU', icon: <Percent size={16} /> },
          { id: 'profile', label: 'Profil Koperasi', icon: <Globe size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'rbac' && <RBACMatrix />}
      {activeTab === 'shu' && <SHUConfigPanel />}
      {activeTab === 'profile' && <ProfileSettings />}
    </div>
  );
};

const RBACMatrix = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, p] = await Promise.all([
          settingsService.getRoles(),
          settingsService.getPermissions()
        ]);
        setRoles(r);
        setPermissions(p);
      } catch (err) {
        console.error('Failed to fetch RBAC data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (roleId: string, permId: string, currentChecked: boolean) => {
    setRoles(prev => prev.map(r => {
      if (r.id === roleId) {
        const newPerms = currentChecked
          ? r.permissions.filter(p => p.permissionId !== permId)
          : [...r.permissions, { permissionId: permId, scope: 'GLOBAL' }];
        return { ...r, permissions: newPerms };
      }
      return r;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(roles.map(role => 
        settingsService.updateRolePermissions(role.id, role.permissions)
      ));
      alert('RBAC Matrix berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan RBAC Matrix');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Text.H2>Granular Permission Matrix</Text.H2>
          <Text.Caption className="not-italic">Atur hak akses setiap role secara mendetail (Matrix Mode).</Text.Caption>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-premium border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 min-w-[200px]"><Text.Label>Fitur / Izin</Text.Label></th>
              {roles.map(role => (
                <th key={role.id} className="px-6 py-4 text-center"><Text.Label>{role.name}</Text.Label></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <Text.Body className="font-bold">{perm.description || perm.code}</Text.Body>
                  <Text.Caption className="not-italic">{perm.code}</Text.Caption>
                </td>
                {roles.map(role => {
                  const isChecked = role.permissions.some(p => p.permissionId === perm.id);
                  return (
                    <td key={role.id} className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggle(role.id, perm.id, isChecked)}
                        className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600/10 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SHUConfigPanel = () => {
  const [configs, setConfigs] = useState<SHUConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getSHUConfig()
      .then(setConfigs)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (key: string, val: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, percentage: parseFloat(val) || 0 } : c));
  };

  const total = configs.reduce((acc, curr) => acc + curr.percentage, 0);

  const handleSave = async () => {
    if (total !== 100) return alert('Total persentase harus 100%');
    setSaving(true);
    try {
      await settingsService.updateSHUConfig(configs);
      alert('Formula SHU berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui SHU');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Text.H2>Komposisi Pembagian SHU</Text.H2>
          <Text.Caption className="not-italic">Tentukan prosentase pembagian Sisa Hasil Usaha berdasarkan regulasi RAT.</Text.Caption>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          Simpan Formula
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="card-premium space-y-6">
          {configs.map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <Text.Body className="font-bold">{item.key.replace(/_/g, ' ')}</Text.Body>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={item.percentage} 
                  onChange={(e) => handleUpdate(item.key, e.target.value)}
                  className="w-20 text-right px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600"
                />
                <span className="text-slate-400 font-bold">%</span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <Text.H2>Total</Text.H2>
            <Text.H2 className={total === 100 ? "text-emerald-600" : "text-red-600"}>{total}%</Text.H2>
          </div>
        </div>

        <div className="card-premium bg-slate-900 text-white flex flex-col justify-center items-center text-center p-10">
          <div className="p-4 bg-white/10 rounded-full mb-4">
            <Percent size={32} className="text-blue-400" />
          </div>
          <Text.H2 className="text-white">Auto-Journaling SHU</Text.H2>
          <Text.Caption className="text-slate-400 mt-2 max-w-[240px]">
            Sistem akan otomatis menghasilkan entri jurnal ke akun Ekuitas/Cadangan saat tutup buku berdasarkan formula ini.
          </Text.Caption>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [config, setConfig] = useState<{key: string, value: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.getGlobalConfig()
      .then(setConfig)
      .finally(() => setLoading(false));
  }, []);

  const findValue = (key: string) => config.find(c => c.key === key)?.value || '';

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-slate-200 rounded-[24px] flex items-center justify-center text-slate-400 border-4 border-white shadow-premium">
          <User size={40} />
        </div>
        <div>
          <Text.H2>Identitas Koperasi</Text.H2>
          <button className="text-blue-600 text-sm font-bold mt-1">Ubah Logo Koperasi</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { key: 'COOP_NAME', label: 'Nama Koperasi', default: 'KOPIMU (Koperasi Pintar Multi Usaha)' },
          { key: 'COOP_LEGAL_NO', label: 'No. Badan Hukum', default: 'AHU-001234.AH.01.2024' },
          { key: 'COOP_ADDRESS', label: 'Alamat Pusat', default: 'Jl. Utama No. 45, Jakarta' },
          { key: 'COOP_EMAIL', label: 'Email Official', default: 'info@ksumandiri.id' },
        ].map(field => (
          <div key={field.key}>
            <Text.Label>{field.label}</Text.Label>
            <input 
              type="text" 
              defaultValue={findValue(field.key) || field.default} 
              className="w-full mt-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/10"
            />
          </div>
        ))}
      </div>

      <button className="btn-primary flex items-center gap-2 px-6">
        <Save size={18} /> Simpan Profil
      </button>
    </div>
  );
};
