import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class SavingService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
  ) {}

  async findAll() {
    return this.prisma.saving.findMany({
      include: {
        member: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: { memberId: string; type: string; amount: number }) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Catat Mutasi Simpanan
      const saving = await tx.saving.create({
        data: {
          memberId: data.memberId,
          type: data.type, // POKOK, WAJIB, SUKARELA
          amount: data.amount,
        },
      });

      // 2. Tentukan Mapping Akun berdasarkan Jenis Simpanan
      let creditAccount = '201.03'; // Default Sukarela
      if (data.type === 'POKOK') creditAccount = '201.01';
      else if (data.type === 'WAJIB') creditAccount = '201.02';

      // 3. Otomasi Jurnal SAK EP
      await this.accounting.createJournalEntry({
        description: `Setoran Simpanan ${data.type} - ${data.memberId.slice(0, 8)}`,
        referenceId: saving.id,
        entries: [
          { accountCode: '101.01', debit: data.amount }, // Debit Kas
          { accountCode: creditAccount, credit: data.amount }, // Credit Simpanan
        ],
      });

      return saving;
    });
  }

  async getMemberSummary(memberId: string) {
    const savings = await this.prisma.saving.groupBy({
      by: ['type'],
      where: { memberId },
      _sum: { amount: true },
    });

    return savings.map((s) => ({
      type: s.type,
      total: Number(s._sum.amount) || 0,
    }));
  }
}
