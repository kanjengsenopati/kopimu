import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Seed Permissions
  const permissions = [
    { code: 'CREATE_LOAN', description: 'Buat Ajuan Pinjaman' },
    { code: 'APPROVE_LOAN', description: 'Setujui Pinjaman' },
    { code: 'VIEW_RETAIL_REPORT', description: 'Laporan Penjualan Retail' },
    { code: 'MANAGE_INVENTORY', description: 'Kelola Stok Barang' },
    { code: 'EDIT_COA', description: 'Edit Chart of Accounts' },
    { code: 'VIEW_DASHBOARD', description: 'Akses Dashboard KPI' },
    { code: 'MANAGE_SETTINGS', description: 'Kelola Pengaturan Sistem' },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }
  console.log('Permissions seeded.');

  // 2. Seed Roles
  const roles = [
    { name: 'Admin', isAdmin: true },
    { name: 'Ketua', isAdmin: false },
    { name: 'Bendahara', isAdmin: false },
    { name: 'Sekretaris', isAdmin: false },
    { name: 'Anggota', isAdmin: false },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: r,
    });
  }
  console.log('Roles seeded.');

  // 3. Seed SHU Config
  const shuConfigs = [
    { key: 'CADANGAN_KOPERASI', percentage: 25 },
    { key: 'JASA_SIMPANAN', percentage: 20 },
    { key: 'JASA_USAHA', percentage: 25 },
    { key: 'DANA_PENGURUS', percentage: 10 },
    { key: 'DANA_KARYAWAN', percentage: 5 },
    { key: 'DANA_SOSIAL', percentage: 15 },
  ];

  for (const s of shuConfigs) {
    await prisma.configSHU.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('SHU Config seeded.');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
