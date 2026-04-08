import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MemberModule } from './modules/member/member.module';
import { SavingModule } from './modules/saving/saving.module';
import { LendingModule } from './modules/lending/lending.module';
import { AccountingModule } from './modules/accounting/accounting.module';

@Module({
  imports: [
    PrismaModule,
    SettingsModule,
    MemberModule,
    SavingModule,
    LendingModule,
    AccountingModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
