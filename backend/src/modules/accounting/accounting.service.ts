import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  /**
   * SAK EP: Melakukan pencatatan jurnal double-entry otomatis.
   * Setiap transaksi finansial wajib melewati fungsi ini.
   */
  async createJournalEntry(data: {
    description: string;
    referenceId?: string;
    entries: {
      accountCode: string;
      debit?: number;
      credit?: number;
    }[];
  }) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Buat Header Jurnal
      const journal = await tx.journal.create({
        data: {
          description: data.description,
          reference: data.referenceId,
        },
      });

      // 2. Buat Detail Entry (Double Entry)
      const detailEntries = await Promise.all(
        data.entries.map(async (entry) => {
          const account = await tx.account.findUnique({
            where: { code: entry.accountCode },
          });

          if (!account) throw new Error(`Akun dengan kode ${entry.accountCode} tidak ditemukan.`);

          return tx.journalEntry.create({
            data: {
              journalId: journal.id,
              accountId: account.id,
              debit: entry.debit || 0,
              credit: entry.credit || 0,
            },
          });
        }),
      );

      // 3. Validasi Balance (SAK EP Mandatory)
      const totalDebit = data.entries.reduce((sum, e) => sum + (e.debit || 0), 0);
      const totalCredit = data.entries.reduce((sum, e) => sum + (e.credit || 0), 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error('Jurnal tidak balance! Debit harus sama dengan Kredit.');
      }

      return { journal, entries: detailEntries };
    });
  }
}
