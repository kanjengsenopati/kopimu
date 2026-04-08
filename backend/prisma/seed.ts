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

  // 4. Seed Accounts (COA - SAK EP)
  const accounts = [
    { code: '101.01', name: 'Kas Tunai', category: 'ASSET', type: 'CASH' },
    { code: '102.01', name: 'Piutang Pinjaman Anggota', category: 'ASSET', type: 'RECEIVABLE' },
    { code: '103.01', name: 'Persediaan Barang Retail', category: 'ASSET', type: 'INVENTORY' },
    { code: '201.01', name: 'Simpanan Pokok', category: 'EQUITY', type: 'EQUITY' },
    { code: '201.02', name: 'Simpanan Wajib', category: 'EQUITY', type: 'EQUITY' },
    { code: '201.03', name: 'Simpanan Sukarela', category: 'LIABILITY', type: 'PAYABLE' },
    { code: '401.01', name: 'Pendapatan Retail', category: 'REVENUE', type: 'REVENUE' },
    { code: '401.02', name: 'Pendapatan Jasa Pinjaman', category: 'REVENUE', type: 'REVENUE' },
    { code: '401.03', name: 'Pendapatan Admin Pinjaman', category: 'REVENUE', type: 'REVENUE' },
    { code: '501.01', name: 'Beban Operasional', category: 'EXPENSE', type: 'EXPENSE' },
  ];

  for (const a of accounts) {
    await prisma.account.upsert({
      where: { code: a.code },
      update: {},
      create: a,
    });
  }
  console.log('Accounts (COA) seeded.');

  // 5. Seed System Config (Koperasi Rules)
  const appConfigs = [
    { key: 'LOAN_ADMIN_FEE_ENABLED', value: 'ON' },
    { key: 'LOAN_ADMIN_FEE_TYPE', value: 'PERCENT' },
    { key: 'LOAN_ADMIN_FEE_VALUE', value: '1' },
    { key: 'MANDATORY_SAVING_ENABLED', value: 'ON' },
    { key: 'MANDATORY_SAVING_VALUE', value: '50000' },
  ];

  for (const c of appConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
  console.log('System Config seeded.');

  // 6. Seed Warehouses
  const warehouses = [
    { name: 'Gudang Pusat', location: 'Jakarta' },
    { name: 'Toko Retail Utama', location: 'Jakarta' },
  ];

  for (const w of warehouses) {
    await prisma.warehouse.upsert({
      where: { id: w.name }, // Hackish for seed, maybe use name as unique for seed
      update: {},
      create: w,
    });
  }
  console.log('Warehouses seeded.');

  // 7. Seed Demo Users & Members
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
  const memberRole = await prisma.role.findUnique({ where: { name: 'Anggota' } });

  if (adminRole && memberRole) {
    // Admin User
    await prisma.user.upsert({
      where: { email: 'admin@kopimu.id' },
      update: {},
      create: {
        email: 'admin@kopimu.id',
        password: 'password123', // Demo only
        roleId: adminRole.id,
      },
    });

    // Demo Member
    const demoMember = await prisma.member.upsert({
      where: { nik: '1234567890' },
      update: {},
      create: {
        nik: '1234567890',
        nama: 'Budi Santoso (Demo Anggota)',
        alamat: 'Jl. Melati No. 10, Jakarta',
        telepon: '081234567890',
        status: 'AKTIF',
      },
    });

    // Member User
    await prisma.user.upsert({
      where: { email: 'anggota@kopimu.id' },
      update: {},
      create: {
        email: 'anggota@kopimu.id',
        password: 'password123',
        roleId: memberRole.id,
        memberId: demoMember.id,
      },
    });
    console.log('Demo Users and Member seeded.');
  }

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
