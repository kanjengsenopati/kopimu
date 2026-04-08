import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class RetailService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
  ) {}

  /**
   * Transaksi Retail POS dengan Multi-Gudang & Otomasi Jurnal SAK EP.
   */
  async createSale(data: {
    warehouseId: string;
    memberId?: string;
    items: { productId: string; qty: number }[];
  }) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let totalSale = 0;

      // 1. Kurangi Stok & Hitung Total
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Produk ${item.productId} tidak ada.`);

        const stock = await tx.stock.findUnique({
          where: { productId_warehouseId: { productId: item.productId, warehouseId: data.warehouseId } },
        });

        if (!stock || stock.qty < item.qty) {
          throw new Error(`Stok di gudang tidak mencukupi untuk ${product.name}.`);
        }

        // Update Stok
        await tx.stock.update({
          where: { id: stock.id },
          data: { qty: stock.qty - item.qty },
        });

        totalSale += Number(product.sellPrice) * item.qty;
      }

      // 2. Simpan Transaksi Penjualan
      const sale = await tx.sale.create({
        data: {
          warehouseId: data.warehouseId,
          memberId: data.memberId,
          total: totalSale,
          items: {
            create: await Promise.all(data.items.map(async (item) => {
               const p = await tx.product.findUnique({ where: { id: item.productId } });
               return {
                 productId: item.productId,
                 qty: item.qty,
                 price: p!.sellPrice,
                 subtotal: Number(p!.sellPrice) * item.qty,
               };
            })),
          },
        },
      });

      // 3. Jurnal Akuntansi (Otomatis SAK EP)
      await this.accounting.createJournalEntry({
        description: `Penjualan Retail - INV-${sale.id.slice(0, 8)}`,
        referenceId: sale.id,
        entries: [
          { accountCode: '101.01', debit: totalSale }, // Debit: Kas
          { accountCode: '401.01', credit: totalSale }, // Credit: Pendapatan Retail
        ],
      });

      return sale;
    });
  }
}
