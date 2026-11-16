import * as XLSX from 'xlsx';
import {
  BaksosAgenda,
  CashTransaction,
  ResidentHouse,
  SiteConfig,
} from '../types';
import { BalanceBreakdown } from '../hooks/useStorage';
import {
  computeOverallKKRecapList,
  formatDateDDMMYYYY,
  formatMonthYearFromDate,
  formatMonthYearFromKey,
  getMonthKeyFromDate,
  getSubsequentMonthLabels,
  isHouseVacant,
  getHouseDuesNominalForPeriod,
  parseIndonesianMonthYearToKey,
} from './helpers';

export interface FinancialExportOptions {
  config: SiteConfig;
  transactions: CashTransaction[];
  residents: ResidentHouse[];
  baksosAgendas?: BaksosAgenda[];
  balances: BalanceBreakdown;
  exportScope?: 'all' | 'mutasi_only' | 'per_kk_only' | 'rekap_total_only' | 'tunggakan_only';
}

/**
 * Export seluruh laporan keuangan (Ringkasan Saldo, Rekap Bulanan, Mutasi Keluar Masuk, Kas Per KK, & Rincian Tunggakan)
 * ke dalam satu file Microsoft Excel (.xlsx) profesional untuk akses Admin.
 */
export function exportFinancialReportToExcel({
  config,
  transactions,
  residents,
  baksosAgendas = [],
  balances,
  exportScope = 'all',
}: FinancialExportOptions) {
  const wb = XLSX.utils.book_new();
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentPeriod = config.duesCurrentMonth || 'Oktober 2026';
  const defaultNominal = config.duesAmountPerMonth || 50000;
  const { recapList: overallKKRecapList, sortedPeriods: recapSortedPeriods } = computeOverallKKRecapList(
    residents,
    config,
    transactions,
    baksosAgendas
  );

  const getHouseDuesNominal = (house: ResidentHouse, periodLabel?: string) =>
    getHouseDuesNominalForPeriod(house, periodLabel || currentPeriod, config, transactions);

  const occupiedResidents = residents.filter((h) => h.occupancy !== 'Kosong');
  const totalInflow = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCurrentMonthCollected = occupiedResidents.reduce((sum, h) => {
    const nom = getHouseDuesNominal(h);
    if (h.duesStatus === 'Lunas' || h.duesStatus === 'Bayar Lebih') return sum + nom;
    return sum + (h.duesPaidAmount || 0);
  }, 0);

  const totalPrepaidAdvance = occupiedResidents.reduce((sum, h) => {
    if (h.duesStatus === 'Bayar Lebih') return sum + (h.duesPrepaidBalance || 0);
    return sum;
  }, 0);

  // 1. SHEET: RINGKASAN SALDO & REKAP KEUANGAN
  if (exportScope === 'all') {
    const summaryRows = [
      {
        'Komponen Laporan Keuangan': 'Nama Gang / Portal',
        'Nilai / Nominal (Rp)': config.title || 'Warga Gang Mandor Blok K2/25 - K3/24',
        Keterangan: (config.subtitle || 'Transparansi Keuangan & Kas Gang').replace(/Lingkungan/gi, 'Gang'),
      },
      {
        'Komponen Laporan Keuangan': 'Periode Bulan Berjalan',
        'Nilai / Nominal (Rp)': currentPeriod,
        Keterangan: `Tanggal Cetak Excel: ${formatDateDDMMYYYY(todayStr)}`,
      },
      {
        'Komponen Laporan Keuangan': 'Saldo Kas Utama (Rp)',
        'Nilai / Nominal (Rp)': balances.kasUtama,
        Keterangan: 'Iuran bulanan warga, denda baksos & pengeluaran gang',
      },
      {
        'Komponen Laporan Keuangan': 'Saldo Cashback WiFi (Rp)',
        'Nilai / Nominal (Rp)': balances.wifiCashback,
        Keterangan: 'Komisi / bagi hasil kemitraan provider internet gang',
      },
      {
        'Komponen Laporan Keuangan': 'Saldo Cashback Sampah (Rp)',
        'Nilai / Nominal (Rp)': balances.sampahCashback,
        Keterangan: 'Dana pengelolaan bank sampah & daur ulang',
      },
      {
        'Komponen Laporan Keuangan': 'TOTAL AKUMULASI SELURUH KAS (Rp)',
        'Nilai / Nominal (Rp)': balances.total,
        Keterangan: 'Total Gabungan Kas Utama + Cashback WiFi + Cashback Sampah',
      },
      {
        'Komponen Laporan Keuangan': 'Total Pemasukan Tercatat (Rp)',
        'Nilai / Nominal (Rp)': totalInflow,
        Keterangan: `${transactions.filter((t) => t.type === 'masuk').length} transaksi uang masuk`,
      },
      {
        'Komponen Laporan Keuangan': 'Total Pengeluaran Tercatat (Rp)',
        'Nilai / Nominal (Rp)': totalOutflow,
        Keterangan: `${transactions.filter((t) => t.type === 'keluar').length} transaksi uang keluar`,
      },
      {
        'Komponen Laporan Keuangan': 'Iuran Bulan Berjalan Terkumpul (Rp)',
        'Nilai / Nominal (Rp)': totalCurrentMonthCollected,
        Keterangan: `${
          occupiedResidents.filter(
            (h) => h.duesStatus === 'Lunas' || h.duesStatus === 'Bayar Lebih'
          ).length
        } dari ${occupiedResidents.length} rumah wajib iuran telah lunas`,
      },
      {
        'Komponen Laporan Keuangan': 'Deposit Kas Bayar Lebih >1 Bulan (Rp)',
        'Nilai / Nominal (Rp)': totalPrepaidAdvance,
        Keterangan: `${
          occupiedResidents.filter((h) => h.duesStatus === 'Bayar Lebih').length
        } rumah memiliki saldo deposit untuk bulan berikutnya`,
      },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
    wsSummary['!cols'] = [{ wch: 36 }, { wch: 28 }, { wch: 52 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Keuangan');
  }

  // 1B. SHEET: REKAP BULANAN IURAN KAS & KELUAR MASUK UANG
  if (exportScope === 'all' || exportScope === 'mutasi_only') {
    const monthBuckets: Record<
      string,
      {
        monthKey: string;
        monthLabel: string;
        txCount: number;
        iuranMasuk: number;
        wifiMasuk: number;
        sampahMasuk: number;
        dendaMasuk: number;
        lainMasuk: number;
        totalMasuk: number;
        totalKeluar: number;
      }
    > = {};

    transactions.forEach((tx) => {
      const mKey = getMonthKeyFromDate(tx.date);
      if (!monthBuckets[mKey]) {
        monthBuckets[mKey] = {
          monthKey: mKey,
          monthLabel: formatMonthYearFromKey(mKey),
          txCount: 0,
          iuranMasuk: 0,
          wifiMasuk: 0,
          sampahMasuk: 0,
          dendaMasuk: 0,
          lainMasuk: 0,
          totalMasuk: 0,
          totalKeluar: 0,
        };
      }
      const b = monthBuckets[mKey];
      b.txCount += 1;
      if (tx.type === 'masuk') {
        b.totalMasuk += tx.amount;
        if (tx.category === 'Iuran Warga') b.iuranMasuk += tx.amount;
        else if (tx.pool === 'Cashback WiFi' || tx.category === 'Cashback WiFi')
          b.wifiMasuk += tx.amount;
        else if (tx.pool === 'Cashback Sampah' || tx.category === 'Cashback Sampah')
          b.sampahMasuk += tx.amount;
        else if (tx.category === 'Denda Baksos') b.dendaMasuk += tx.amount;
        else b.lainMasuk += tx.amount;
      } else {
        b.totalKeluar += tx.amount;
      }
    });

    const monthlyRows = Object.values(monthBuckets)
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
      .map((m, idx) => ({
        No: idx + 1,
        'Periode Bulan': m.monthLabel,
        'Kode Bulan': m.monthKey,
        'Jumlah Transaksi': m.txCount,
        'Iuran Kas Warga Masuk (Rp)': m.iuranMasuk,
        'Cashback WiFi Masuk (Rp)': m.wifiMasuk,
        'Cashback Sampah Masuk (Rp)': m.sampahMasuk,
        'Denda Baksos Masuk (Rp)': m.dendaMasuk,
        'Pemasukan Lainnya (Rp)': m.lainMasuk,
        'TOTAL UANG MASUK (Rp)': m.totalMasuk,
        'TOTAL UANG KELUAR (Rp)': m.totalKeluar,
        'SELISIH KAS BERSIH BULANAN (Rp)': m.totalMasuk - m.totalKeluar,
      }));

    const wsMonthly = XLSX.utils.json_to_sheet(monthlyRows);
    wsMonthly['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 12 },
      { wch: 16 },
      { wch: 24 },
      { wch: 22 },
      { wch: 24 },
      { wch: 22 },
      { wch: 20 },
      { wch: 22 },
      { wch: 22 },
      { wch: 26 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMonthly, 'Rekap Bulanan Kas');
  }

  // 2. SHEET: MUTASI KELUAR MASUK KAS (LEDGER TRANSAKSI)
  if (exportScope === 'all' || exportScope === 'mutasi_only') {
    // Sort chronologically ascending to compute running balance accurately, then display
    const sortedAsc = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    let runningTotal = 0;
    const ledgerWithRunning = sortedAsc.map((tx) => {
      const signedVal = tx.type === 'masuk' ? tx.amount : -tx.amount;
      runningTotal += signedVal;
      return {
        ...tx,
        runningBalance: runningTotal,
      };
    });

    const ledgerRows = ledgerWithRunning.reverse().map((tx, idx) => ({
      No: idx + 1,
      'ID Transaksi': tx.id,
      'Kelompok Bulan': formatMonthYearFromDate(tx.date),
      Tanggal: formatDateDDMMYYYY(tx.date),
      'Tanggal ISO': tx.date,
      'Alokasi Pos Kas': tx.pool,
      Kategori: tx.category,
      'Uraian / Keterangan Transaksi': tx.description,
      'Jenis Mutasi': tx.type === 'masuk' ? 'UANG MASUK (+)' : 'UANG KELUAR (-)',
      'Nominal Masuk (Rp)': tx.type === 'masuk' ? tx.amount : 0,
      'Nominal Keluar (Rp)': tx.type === 'keluar' ? tx.amount : 0,
      'Mutasi Bersih (Rp)': tx.type === 'masuk' ? tx.amount : -tx.amount,
      'Saldo Akumulasi Berjalan (Rp)': tx.runningBalance,
    }));

    const wsMutasi = XLSX.utils.json_to_sheet(ledgerRows);
    wsMutasi['!cols'] = [
      { wch: 5 },
      { wch: 16 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 18 },
      { wch: 22 },
      { wch: 48 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMutasi, 'Mutasi Keluar Masuk Kas');
  }

  // 3. SHEET: LAPORAN KAS & IURAN PER KK
  if (exportScope === 'all' || exportScope === 'per_kk_only') {
    const perKKRows = residents.map((house, idx) => {
      const isEmpty =
        house.occupancy === 'Kosong' ||
        isHouseVacant(house);
      const nominal = getHouseDuesNominal(house);
      const isAdvance = house.duesStatus === 'Bayar Lebih';
      const isLunas = house.duesStatus === 'Lunas' || isAdvance;
      const paidMonths = isAdvance
        ? Math.max(2, house.duesPaidMonths || 2)
        : isLunas
        ? 1
        : 0;
      const prepaidDeposit = isAdvance ? house.duesPrepaidBalance || 0 : 0;
      const paidThisMonth = isAdvance
        ? nominal + prepaidDeposit
        : isLunas
        ? nominal
        : isEmpty
        ? 0
        : house.duesPaidAmount || 0;
      const remainingThisMonth = isEmpty
        ? 0
        : isLunas
        ? 0
        : Math.max(0, nominal - (house.duesPaidAmount || 0));

      const basePeriod = house.duesMonthNote || currentPeriod;
      const coveredMonths = isLunas
        ? getSubsequentMonthLabels(basePeriod, Math.max(1, paidMonths)).join(', ')
        : isEmpty
        ? 'Bebas Iuran (Kosong)'
        : basePeriod;

      const recapItem = overallKKRecapList.find((r) => r.house.id === house.id);
      const curDet = recapItem?.periodsDetail.find((d) => d.periodLabel === currentPeriod);
      const dendaBaksosAmount = curDet ? curDet.dendaPaid : 0;
      const tunggakanPaid = curDet ? curDet.tunggakanPaid : 0;
      const totalSemuaPenerimaan = paidThisMonth + dendaBaksosAmount + tunggakanPaid;

      return {
        No: idx + 1,
        'No Blok': house.blockNumber,
        'Kepala Keluarga': house.headName,
        'No. WhatsApp': house.phone || '-',
        'Status Hunian': house.occupancy,
        'Status Kepemilikan': house.ownership,
        'Periode Bulan': basePeriod,
        'Alokasi Bulan Tercover': coveredMonths,
        'Wajib Iuran Rutin': isEmpty ? 'Bebas Iuran (Kosong)' : 'Wajib / Boleh Bayar',
        'Nominal Iuran / Bulan (Rp)': isEmpty && !isLunas ? 0 : nominal,
        'Status Pembayaran': isEmpty
          ? isLunas
            ? isAdvance
              ? `Bayar Lebih (Kosong ${paidMonths} Bulan)`
              : 'Lunas (Rumah Kosong)'
            : 'Bebas Iuran (Kosong)'
          : isAdvance
          ? `Bayar Lebih (${paidMonths} Bulan)`
          : house.duesStatus,
        'Jumlah Bulan Dibayar': paidMonths,
        'Iuran Kas Diterima (Rp)': paidThisMonth,
        'Denda Baksos (Rp)': dendaBaksosAmount,
        'Pembayaran Tunggakan (Rp)': tunggakanPaid,
        'Total Pembayaran Diterima (Rp)': totalSemuaPenerimaan,
        'Saldo Deposit Bulan Depan (Rp)': prepaidDeposit,
        'Cicilan Berjalan (Rp)': !isLunas && !isEmpty ? house.duesPaidAmount || 0 : 0,
        'Sisa Tagihan Bulan Ini (Rp)': remainingThisMonth,
        'Tanggal Bayar': house.duesPaidDate ? formatDateDDMMYYYY(house.duesPaidDate) : '-',
      };
    });

    const wsPerKK = XLSX.utils.json_to_sheet(perKKRows);
    wsPerKK['!cols'] = [
      { wch: 5 },
      { wch: 10 },
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 28 },
      { wch: 20 },
      { wch: 22 },
      { wch: 22 },
      { wch: 18 },
      { wch: 22 },
      { wch: 20 },
      { wch: 22 },
      { wch: 24 },
      { wch: 24 },
      { wch: 18 },
      { wch: 22 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, wsPerKK, 'Laporan Kas Per KK');
  }

  // 3B. SHEET: REKAP KESELURUHAN KAS PER KK (GABUNGAN SEMUA PERIODE)
  if (exportScope === 'all' || exportScope === 'rekap_total_only') {
    const sortedAllPeriods =
      recapSortedPeriods.length > 0 ? recapSortedPeriods : [currentPeriod];

    const overallRows = residents.map((house, idx) => {
      const recapItem = overallKKRecapList.find((r) => r.house.id === house.id);
      const isUnoccupied = recapItem ? recapItem.isUnoccupied : house.occupancy === 'Belum Ditempati';
      const isPureKosong = recapItem
        ? recapItem.isPureKosong
        : !isUnoccupied && (house.occupancy === 'Kosong' || isHouseVacant(house));
      const nominal = recapItem ? recapItem.nominalPerMonth : isPureKosong ? 0 : getHouseDuesNominal(house);
      const payerName = recapItem
        ? recapItem.payerName
        : isPureKosong
        ? 'Rumah Kosong'
        : isUnoccupied
        ? house.duesHeadNameOverride || 'Belum Ditempati'
        : house.duesHeadNameOverride || house.headName || '';

      const periodStatusMap: Record<string, string> = {};

      sortedAllPeriods.forEach((pLabel) => {
        const pDet = recapItem?.periodsDetail.find((d) => d.periodLabel === pLabel);
        const periodHeadName = pDet?.periodHeadName || payerName;
        const isPeriodVacant = Boolean(pDet?.isPeriodVacant);
        const iuranPeriod = pDet?.iuranPaid ?? 0;
        const tunggakanPeriod = pDet?.tunggakanPaid ?? 0;
        const dendaPeriod = pDet?.dendaPaid ?? 0;

        let periodStatusText = 'Belum Bayar';
        if (isPureKosong || isPeriodVacant) {
          periodStatusText =
            iuranPeriod > 0
              ? `Lunas (Kosong +Rp ${iuranPeriod.toLocaleString('id-ID')})`
              : 'Bebas Iuran (Kosong)';
        } else if (pDet?.isAdvanceSubsequent) {
          periodStatusText = pDet.advancePaymentMonth
            ? `Lunas di Bulan ${pDet.advancePaymentMonth} (Bayar >1 Bulan)`
            : 'Lunas (Bayar >1 Bulan)';
        } else if (pDet?.isArrearSettledLater) {
          // Pelunasan tunggakan bulan lalu: hanya ditandai lunas tanpa menambahkan nominal
          periodStatusText = `Lunas Bulan ${pDet.settlementMonth || 'Pelunasan'}`;
        } else if (pDet?.statusInfo?.status === 'Bayar Lebih' || (iuranPeriod > nominal && !isPureKosong)) {
          periodStatusText = `Bayar Lebih (+Rp ${iuranPeriod.toLocaleString('id-ID')})`;
        } else if (pDet?.isLunasThisPeriod) {
          periodStatusText = `Lunas (+Rp ${iuranPeriod.toLocaleString('id-ID')})`;
        } else if (iuranPeriod > 0) {
          periodStatusText = `Cicil (+Rp ${iuranPeriod.toLocaleString('id-ID')})`;
        }

        const extraNotes: string[] = [];
        if (tunggakanPeriod > 0) {
          extraNotes.push(
            `Bayar Tunggakan${pDet?.tunggakanDetailNote ? ` ${pDet.tunggakanDetailNote}` : ''} +Rp ${tunggakanPeriod.toLocaleString('id-ID')}`
          );
        }
        if (dendaPeriod > 0) {
          extraNotes.push(`Denda Baksos +Rp ${dendaPeriod.toLocaleString('id-ID')}`);
        } else if (pDet?.isDendaSettledLater) {
          extraNotes.push(`Denda Lunas di Bulan ${pDet.dendaSettlementMonth || 'Berikutnya'}`);
        } else if ((pDet?.baksosFineUnpaid || 0) > 0) {
          extraNotes.push(`Denda Baksos Belum Bayar Rp ${(pDet?.baksosFineUnpaid || 0).toLocaleString('id-ID')}`);
        }

        const suffix = extraNotes.length > 0 ? ` | ${extraNotes.join(', ')}` : '';
        periodStatusMap[`Periode ${pLabel}`] = `${periodHeadName} (${periodStatusText}${suffix})`;
      });

      const totalIuranAll = recapItem?.totalIuranAllPeriods ?? 0;
      const totalDendaAll = recapItem?.totalDendaAllPeriods ?? 0;
      const totalTunggakanAll = recapItem?.totalTunggakanAllPeriods ?? 0;
      const grandTotalAll = recapItem?.grandTotalAllPeriods ?? 0;
      const lunasPeriodsCount = recapItem?.totalPeriodsPaidCount ?? 0;
      const remainingTotal = recapItem?.previousDuesArrears ?? 0;
      const baksosUnpaidTotal = recapItem?.baksosFineArrears ?? 0;

      let statusOverall = 'LUNAS SEMUA PERIODE';
      if (isPureKosong || recapItem?.overallStatus === 'Kosong') {
        statusOverall = 'BEBAS IURAN (KOSONG)';
      } else if (recapItem?.overallStatus === 'Bayar Lebih') {
        statusOverall = 'BAYAR LEBIH (>1 BLN)';
      } else if (recapItem?.overallStatus === 'Lunas Semua') {
        statusOverall = 'LUNAS SEMUA PERIODE';
      } else {
        statusOverall = 'ADA TUNGGAKAN';
      }

      return {
        No: idx + 1,
        'No Blok': house.blockNumber,
        'Nama Kepala Keluarga': payerName,
        ...periodStatusMap,
        'Jumlah Periode Tercatat': sortedAllPeriods.length,
        'Periode Lunas': isPureKosong ? '-' : `${lunasPeriodsCount} dari ${sortedAllPeriods.length} Periode`,
        'Total Iuran Rutin (Rp)': totalIuranAll,
        'Total Denda Baksos (Rp)': totalDendaAll,
        'Total Pembayaran Tunggakan (Rp)': totalTunggakanAll,
        'TOTAL KESELURUHAN KAS MASUK (Rp)': grandTotalAll,
        'Sisa Tunggakan Bulan Lalu (Rp)': remainingTotal,
        'Denda Baksos Belum Bayar (Rp)': baksosUnpaidTotal,
        'Status Kelunasan Keseluruhan': statusOverall,
      };
    });

    // Hitung Akumulasi Total Pemasukan Kas, Tunggakan & Baksos per Kolom Periode
    const periodTotalsPemasukan: Record<string, string> = {};
    const periodTotalsTunggakan: Record<string, string> = {};
    const periodTotalsBaksos: Record<string, string> = {};

    let sumTotalIuranAll = 0;
    let sumTotalDendaAll = 0;
    let sumTotalTunggakanAll = 0;
    let sumGrandTotalAll = 0;
    let sumTotalRemainingArrears = 0;
    let sumTotalUnpaidBaksos = 0;

    overallRows.forEach((r: any) => {
      sumTotalIuranAll += Number(r['Total Iuran Rutin (Rp)']) || 0;
      sumTotalDendaAll += Number(r['Total Denda Baksos (Rp)']) || 0;
      sumTotalTunggakanAll += Number(r['Total Pembayaran Tunggakan (Rp)']) || 0;
      sumGrandTotalAll += Number(r['TOTAL KESELURUHAN KAS MASUK (Rp)']) || 0;
      sumTotalRemainingArrears += Number(r['Sisa Tunggakan Bulan Lalu (Rp)']) || 0;
      sumTotalUnpaidBaksos += Number(r['Denda Baksos Belum Bayar (Rp)']) || 0;
    });

    sortedAllPeriods.forEach((pLabel) => {
      const pKey = parseIndonesianMonthYearToKey(pLabel) || '';
      let periodInflow = 0;
      let periodUnpaid = 0;

      overallKKRecapList.forEach((item) => {
        const pDet = item.periodsDetail.find((d) => d.periodLabel === pLabel);
        if (pDet) {
          periodInflow += pDet.periodTotal;
          if (pDet.unpaidAmount > 0) {
            periodUnpaid += pDet.unpaidAmount;
          }
        }
      });

      const matchingAgendas = baksosAgendas.filter((a) => {
        const mKey = getMonthKeyFromDate(a.date);
        return mKey === pKey || formatMonthYearFromKey(mKey) === pLabel;
      });

      periodTotalsPemasukan[`Periode ${pLabel}`] = `+Rp ${periodInflow.toLocaleString('id-ID')}`;
      periodTotalsTunggakan[`Periode ${pLabel}`] = periodUnpaid > 0 ? `Rp ${periodUnpaid.toLocaleString('id-ID')} (Tertunggak)` : 'Lunas 100%';
      periodTotalsBaksos[`Periode ${pLabel}`] = matchingAgendas.length > 0 ? `Baksos (${matchingAgendas[0].title})` : 'Tidak Ada Agenda';
    });

    // Baris 1: TOTAL PEMASUKAN KAS PER PERIODE
    (overallRows as any).push({
      No: 'TOTAL',
      'No Blok': 'PEMASUKAN',
      'Nama Kepala Keluarga': 'TOTAL PEMASUKAN KAS PER PERIODE',
      ...periodTotalsPemasukan,
      'Jumlah Periode Tercatat': sortedAllPeriods.length,
      'Periode Lunas': 'Akumulasi Kas',
      'Total Iuran Rutin (Rp)': sumTotalIuranAll,
      'Total Denda Baksos (Rp)': sumTotalDendaAll,
      'Total Pembayaran Tunggakan (Rp)': sumTotalTunggakanAll,
      'TOTAL KESELURUHAN KAS MASUK (Rp)': sumGrandTotalAll,
      'Sisa Tunggakan Bulan Lalu (Rp)': sumTotalRemainingArrears,
      'Denda Baksos Belum Bayar (Rp)': sumTotalUnpaidBaksos,
      'Status Kelunasan Keseluruhan': 'TOTAL PEMASUKAN SEMUA PERIODE',
    });

    // Baris 2: TOTAL SISA TUNGGAKAN PER PERIODE
    (overallRows as any).push({
      No: 'TOTAL',
      'No Blok': 'TUNGGAKAN',
      'Nama Kepala Keluarga': 'SISA TUNGGAKAN IURAN PERIODE',
      ...periodTotalsTunggakan,
      'Jumlah Periode Tercatat': '-',
      'Periode Lunas': '-',
      'Total Iuran Rutin (Rp)': '-',
      'Total Denda Baksos (Rp)': '-',
      'Total Pembayaran Tunggakan (Rp)': '-',
      'TOTAL KESELURUHAN KAS MASUK (Rp)': '-',
      'Sisa Tunggakan Bulan Lalu (Rp)': sumTotalRemainingArrears,
      'Denda Baksos Belum Bayar (Rp)': sumTotalUnpaidBaksos,
      'Status Kelunasan Keseluruhan': 'SISA TUNGGAKAN AKTIF',
    });

    // Baris 3: DETAIL BAKSOS PER PERIODE
    (overallRows as any).push({
      No: 'DETAIL',
      'No Blok': 'BAKSOS',
      'Nama Kepala Keluarga': 'STATUS AGENDA BAKTI SOSIAL (BAKSOS)',
      ...periodTotalsBaksos,
      'Jumlah Periode Tercatat': '-',
      'Periode Lunas': '-',
      'Total Iuran Rutin (Rp)': '-',
      'Total Denda Baksos (Rp)': sumTotalDendaAll,
      'Total Pembayaran Tunggakan (Rp)': '-',
      'TOTAL KESELURUHAN KAS MASUK (Rp)': '-',
      'Sisa Tunggakan Berjalan (Rp)': '-',
      'Status Kelunasan Keseluruhan': 'DETAIL BAKSOS & DENDA',
    });

    const wsOverall = XLSX.utils.json_to_sheet(overallRows);
    wsOverall['!cols'] = [
      { wch: 5 },
      { wch: 10 },
      { wch: 24 },
      { wch: 16 },
      { wch: 22 },
      { wch: 24 },
      { wch: 22 },
      { wch: 22 },
      { wch: 26 },
      { wch: 30 },
      { wch: 24 },
      { wch: 26 },
    ];
    XLSX.utils.book_append_sheet(wb, wsOverall, 'Rekap Keseluruhan Kas Per KK');
  }

  // 4. SHEET: RINCIAN TUNGGAKAN & DENDA WARGA
  if (exportScope === 'all' || exportScope === 'tunggakan_only') {
    const arrearsRows = residents.map((house, idx) => {
      const recapItem = overallKKRecapList.find((r) => r.house.id === house.id);
      const duesArrears = recapItem ? recapItem.currentMonthDuesArrears : 0;
      const unpaidBaksos = recapItem ? recapItem.unpaidBaksosList : [];
      const baksosFineArrears = recapItem ? recapItem.baksosFineArrears : 0;
      const previousArrears = recapItem ? recapItem.previousDuesArrears : 0;
      const previousArrearsNote = recapItem?.previousArrearsNote || house.previousArrearsNote || '-';
      const totalArrears = duesArrears + baksosFineArrears + previousArrears;

      return {
        No: idx + 1,
        'No Blok': house.blockNumber,
        'Kepala Keluarga': house.headName,
        'No. WhatsApp': house.phone || '-',
        'Status Hunian': house.occupancy,
        [`Tunggakan Iuran Bulan Ini (${config.duesCurrentMonth || 'Bulan Berjalan'}) (Rp)`]: duesArrears,
        'Jumlah Absen Baksos Belum Lunas': unpaidBaksos.length,
        'Tunggakan Denda Baksos (Rp)': baksosFineArrears,
        'Keterangan Denda Baksos': house.previousBaksosArrearsNote || '-',
        'Tunggakan Bulan/Tahun Lalu (Rp)': previousArrears,
        'Keterangan Tunggakan Lalu': previousArrearsNote || '-',
        'Rincian Kompilasi Tunggakan Lalu': [
          previousArrearsNote && previousArrearsNote !== '-' ? `Iuran: ${previousArrearsNote}` : '',
          (house.previousBaksosArrears || 0) > 0 ? `Denda: Rp ${(house.previousBaksosArrears || 0).toLocaleString('id-ID')}` : '',
          house.previousBaksosArrearsNote ? `Ket Denda: ${house.previousBaksosArrearsNote}` : ''
        ].filter(Boolean).join(' | ') || '-',
        'TOTAL TUNGGAKAN (Rp)': totalArrears,
        'Status Tagihan': totalArrears > 0 ? 'TERTUNGGAK' : 'LUNAS / BERSIH',
      };
    });

    const wsArrears = XLSX.utils.json_to_sheet(arrearsRows);
    wsArrears['!cols'] = [
      { wch: 5 },
      { wch: 10 },
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 26 },
      { wch: 24 },
      { wch: 24 },
      { wch: 26 },
      { wch: 45 },
      { wch: 22 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(wb, wsArrears, 'Rincian Tunggakan');
  }

  const filePrefix =
    exportScope === 'mutasi_only'
      ? 'Laporan_Mutasi_Kas_Gang_Mandor'
      : exportScope === 'per_kk_only'
      ? 'Laporan_Kas_Per_KK_Gang_Mandor'
      : exportScope === 'rekap_total_only'
      ? 'Laporan_Rekap_Keseluruhan_Kas_Per_KK_Gang_Mandor'
      : exportScope === 'tunggakan_only'
      ? 'Laporan_Tunggakan_Warga_Gang_Mandor'
      : 'Laporan_Keuangan_Lengkap_Gang_Mandor';

  XLSX.writeFile(wb, `${filePrefix}_${todayStr}.xlsx`);
}
