import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AccountingService } from './modules/accounting/accounting.service';
import { LendingService } from './modules/lending/lending.service';
import { RetailService } from './modules/retail/retail.service';

@Module({
  imports: [
    PrismaModule,
    SettingsModule,
  ],
  providers: [
    AccountingService, 
    LendingService, 
    RetailService
  ],
  exports: [
    AccountingService, 
    LendingService, 
    RetailService
  ],
})
export class AppModule {}
