import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AccountingService } from '../accounting/accounting.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class LendingService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
    private settings: SettingsService,
  ) {}

  async findAllLoans() {
    return this.prisma.loan.findMany({
      include: { 
        member: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLoanRequest(data: { memberId: string; amount: number; tenor: number; productId?: string }) {
    let productId = data.productId;
    if (!productId) {
      const defaultProduct = await this.prisma.loanProduct.findFirst();
      if (!defaultProduct) throw new Error('Produk Pinjaman belum tersedia. Silakan hubungi admin.');
      productId = defaultProduct.id;
    }

    return this.prisma.loan.create({
      data: {
        memberId: data.memberId,
        productId: productId,
        amount: data.amount,
        tenor: data.tenor,
        status: 'PENDING',
        interestRate: 1.5, // Default internal
      },
    });
  }

  async approveAndDisburse(loanId: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const loan = await tx.loan.findUnique({ 
        where: { id: loanId },
        include: { product: true }
      });
      if (!loan || loan.status !== 'PENDING') throw new Error('Loan not found or already processed');

      // 1. Ambil Kebijakan Biaya Admin
      const configs = await this.settings.getGlobalConfig();
      const adminEnabled = configs.find(c => c.key === 'LOAN_ADMIN_FEE_ENABLED')?.value === 'ON';
      const adminType = configs.find(c => c.key === 'LOAN_ADMIN_FEE_TYPE')?.value || 'PERCENT';
      const adminVal = Number(configs.find(c => c.key === 'LOAN_ADMIN_FEE_VALUE')?.value) || 0;

      const amountNum = Number(loan.amount);
      let adminFee = 0;
      if (adminEnabled) {
        adminFee = adminType === 'PERCENT' ? (amountNum * adminVal) / 100 : adminVal;
      }

      const disbursedAmount = amountNum - adminFee;

      // 2. Update Status Pinjaman
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: { status: 'APPROVED' },
      });

      // 3. Generate Installment Schedule
      const monthlyPokok = amountNum / loan.tenor;
      const monthlyJasa = (amountNum * loan.interestRate) / 100;

      for (let i = 1; i <= loan.tenor; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        
        await tx.installment.create({
          data: {
            loanId,
            periodNo: i,
            principal: monthlyPokok,
            interest: monthlyJasa,
            dueDate,
            status: 'UNPAID',
          },
        });
      }

      // 4. Jurnal Otomatis SAK EP
      await this.accounting.createJournalEntry({
        description: `Pencairan Pinjaman - ${loan.id.slice(0, 8)}`,
        referenceId: loan.id,
        entries: [
          { accountCode: '102.01', debit: amountNum }, // Piutang Pinjaman (Gross)
          { accountCode: '101.01', credit: disbursedAmount }, // Kas Keluar (Net)
          ...(adminFee > 0 ? [{ accountCode: '401.03', credit: adminFee }] : []), // Pendapatan Admin
        ],
      }, tx);

      return updatedLoan;
    });
  }

  async payInstallment(installmentId: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const inst = await tx.installment.findUnique({ 
        where: { id: installmentId },
        include: { loan: true }
      });
      if (!inst || inst.status === 'PAID') throw new Error('Installment not found or paid');

      const totalAmount = Number(inst.principal) + Number(inst.interest);

      // 1. Update Status Angsuran
      await tx.installment.update({
        where: { id: installmentId },
        data: { status: 'PAID', paidDate: new Date() },
      });

      // 2. Jurnal SAK EP
      await this.accounting.createJournalEntry({
        description: `Angsuran Pinjaman - ${inst.loan.id.slice(0, 8)}`,
        referenceId: inst.id,
        entries: [
          { accountCode: '101.01', debit: totalAmount }, // Kas Masuk
          { accountCode: '102.01', credit: Number(inst.principal) }, // Pelunasan Piutang
          { accountCode: '401.02', credit: Number(inst.interest) }, // Pendapatan Jasa
        ],
      }, tx);

      return inst;
    });
  }
}
