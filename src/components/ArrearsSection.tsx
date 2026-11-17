import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  Banknote,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Edit2,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  MessageCircle,
  Pause,
  Phone,
  Play,
  Plus,
  PlusCircle,
  RotateCcw,
  Search,
  Send,
  SkipForward,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';

export const TREASURER_BANK = {
  bankName: 'BCA',
  accountNumber: '7130889411',
  accountName: 'Muhidin Akbar',
  role: 'Bendahara Gang Mandor',
  phone: '+6287887332749',
};
import { BaksosAgenda, CashTransaction, ResidentHouse, SiteConfig } from '../types';
import {
  computeOverallKKRecapList,
  formatMonthYearFromDate,
  formatRupiah,
  getSubsequentMonthLabels,
  isHouseVacant,
  openWhatsAppShare,
  parseIndonesianMonthYearToKey,
  renderArrearsSingleWhatsAppMessage,
  renderArrearsBroadcastWhatsAppMessage,
} from '../utils/helpers';
import { exportFinancialReportToExcel } from '../utils/financialExcelExport';
import { BalanceBreakdown } from '../hooks/useStorage';
import { EditWaTemplateModal } from './EditWaTemplateModal';

interface ArrearsSectionProps {
  config: SiteConfig;
  residents: ResidentHouse[];
  baksosAgendas: BaksosAgenda[];
  transactions?: CashTransaction[];
  balances?: BalanceBreakdown;
  isAdmin: boolean;
  onUpdateResident: (updated: ResidentHouse) => void;
  onAddTransaction: (tx: any) => void;
  onMarkFinePaid: (agendaId: string, residentId: string, houseName: string, blockNo: string) => void;
  onOpenConfigModal?: () => void;
  onUpdateSiteConfig?: (newConfig: Partial<SiteConfig>) => void;
}

export const ArrearsSection: React.FC<ArrearsSectionProps> = ({
  config,
  residents,
  baksosAgendas,
  transactions = [],
  balances = { kasUtama: 0, wifiCashback: 0, sampahCashback: 0, total: 0 },
  isAdmin,
  onUpdateResident,
  onAddTransaction,
  onMarkFinePaid,
  onOpenConfigModal,
  onUpdateSiteConfig,
}) => {
  // Modal Edit Template Pesan WhatsApp
  const [isWaTemplateModalOpen, setIsWaTemplateModalOpen] = useState(false);

  // Modal Pembayaran Sebagian (Cicil) Tunggakan Per Rumah
  const [partialPayItem, setPartialPayItem] = useState<any | null>(null);
  const [partialAmount, setPartialAmount] = useState<number>(20000);
  const [partialNote, setPartialNote] = useState<string>('');

  // Batch Auto-Billing via WhatsApp (Penarikan Tagihan Otomatis Sekaligus)
  const [isBatchBillingModalOpen, setIsBatchBillingModalOpen] = useState(false);
  const [batchBillingTab, setBatchBillingTab] = useState<'runner' | 'broadcast' | 'list'>('runner');
  const [runnerIndex, setRunnerIndex] = useState<number>(0);
  const [isRunnerActive, setIsRunnerActive] = useState<boolean>(false);
  const [runnerDelay, setRunnerDelay] = useState<number>(3);
  const [countdown, setCountdown] = useState<number>(3);
  const [sentHouseIds, setSentHouseIds] = useState<Record<string, boolean>>({});
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [bankInfo, setBankInfo] = useState(
    `${TREASURER_BANK.bankName} ${TREASURER_BANK.accountNumber} a.n. ${TREASURER_BANK.accountName} (${TREASURER_BANK.role}) / Tunai ke Rumah Bendahara`
  );
  const [deadlineNote, setDeadlineNote] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Penagihan Tunggakan Warga Per KK (Single Resident Billing Modal)
  const [singleBillingHouse, setSingleBillingHouse] = useState<any | null>(null);
  const [copiedBankNumber, setCopiedBankNumber] = useState(false);
  const [copiedSingleMsg, setCopiedSingleMsg] = useState(false);

  // Modal Edit Keterangan Tunggakan Lalu Per Rumah (Tersinkronisasi ke Tabel Rekap Pembayaran Iuran Per KK)
  const [editingArrearsItem, setEditingArrearsItem] = useState<{ house: ResidentHouse; duesNote: string } | null>(null);
  const [editPrevArrearsNote, setEditPrevArrearsNote] = useState<string>('');
  const [editPrevArrearsAmount, setEditPrevArrearsAmount] = useState<number>(0);

  const handleOpenEditArrears = (house: ResidentHouse, currentNote: string, currentAmount: number) => {
    setEditingArrearsItem({ house, duesNote: currentNote });
    setEditPrevArrearsNote((house.previousArrearsNote || '').trim() || currentNote || '');
    setEditPrevArrearsAmount(house.previousArrears || currentAmount || 0);
  };

  const handleSaveEditArrears = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArrearsItem) return;
    const updatedHouse: ResidentHouse = {
      ...editingArrearsItem.house,
      previousArrears: Math.max(0, Number(editPrevArrearsAmount) || 0),
      previousArrearsNote: editPrevArrearsNote.trim(),
    };
    onUpdateResident(updatedHouse);
    setEditingArrearsItem(null);
  };

  const currentMonthLabel = config.duesCurrentMonth || 'Bulan Berjalan';

  // Rekapitulasi tunggakan bersumber langsung & terpadu dari Tabel Rekapitulasi Keseluruhan Kas Per Kepala Keluarga
  const { recapList, sortedPeriods } = useMemo(() => {
    return computeOverallKKRecapList(residents, config, transactions, baksosAgendas);
  }, [residents, config, transactions, baksosAgendas]);

  const arrearsList = useMemo(() => {
    return recapList.map((row) => {
      const duesArrears = row.currentMonthDuesArrears;
      const baksosFineArrears = row.baksosFineArrears;
      const previousArrears = row.previousDuesArrears;
      const previousBaksosArrears = row.previousBaksosArrears || 0;
      const previousBaksosArrearsNote = row.previousBaksosArrearsNote || '';
      const totalArrears = duesArrears + baksosFineArrears + previousArrears;

      // Keterangan tunggakan lalu langsung bersumber dari isian Tabel Rekap Pembayaran Iuran Per KK
      const rawPrevNote = (row.house.previousArrearsNote || '').trim();
      const previousArrearsNote = rawPrevNote || row.previousArrearsNote || '';

      return {
        house: row.house,
        houseMonthlyNominal: row.nominalPerMonth,
        duesArrears,
        unpaidBaksosList: row.unpaidBaksosList,
        baksosFineArrears,
        previousArrears,
        previousArrearsNote,
        previousBaksosArrears,
        previousBaksosArrearsNote,
        totalArrears,
        unpaidPastPeriods: row.unpaidPastPeriods,
        unpaidPeriods: row.unpaidPeriods,
        periodsDetail: row.periodsDetail,
      };
    });
  }, [recapList]);

  const totalAllArrears = useMemo(() => {
    return arrearsList.reduce((acc, curr) => acc + curr.totalArrears, 0);
  }, [arrearsList]);

  const housesWithArrears = useMemo(
    () => arrearsList.filter((item) => item.totalArrears > 0),
    [arrearsList]
  );

  // Daftar rincian tunggakan HANYA menampilkan warga yang memiliki tunggakan saja
  const filteredDelinquentList = housesWithArrears.filter((item) => {
    const payerName = item.house.duesHeadNameOverride || item.house.headName;
    const matchQuery =
      !searchQuery.trim() ||
      item.house.blockNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.house.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.previousArrearsNote && item.previousArrearsNote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.previousBaksosArrearsNote && item.previousBaksosArrearsNote.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchQuery;
  });

  const settlePastPeriodHistoryForHouse = (
    house: ResidentHouse,
    settlementLabel: string,
    paidDateStr: string,
    options: { settleIuran?: boolean; settleBaksos?: boolean; maxIuranPay?: number }
  ) => {
    const targetRecap = recapList.find((r) => r.house.id === house.id);
    const nextPeriodHist = { ...(house.periodHistory || {}) };
    const settledIuranLabels: string[] = [];
    const settledBaksosLabels: string[] = [];
    const settlementKey = parseIndonesianMonthYearToKey(settlementLabel) || '';
    const nominal = targetRecap?.nominalPerMonth || house.customDuesAmount || config.duesAmountPerMonth || 25000;

    if (options.settleIuran && targetRecap && targetRecap.unpaidPastPeriods.length > 0) {
      let rem = options.maxIuranPay ?? Infinity;
      for (const pLabel of targetRecap.unpaidPastPeriods) {
        if (rem <= 0) break;
        const pKey = parseIndonesianMonthYearToKey(pLabel);
        if (pKey && (!settlementKey || pKey < settlementKey)) {
          const existing = nextPeriodHist[pKey] || nextPeriodHist[pLabel] || {};
          nextPeriodHist[pKey] = {
            ...existing,
            occupancy: existing.occupancy || house.occupancy,
            headName: existing.headName || house.headName,
            duesHeadNameOverride: existing.duesHeadNameOverride || house.duesHeadNameOverride || house.headName,
            duesStatus: 'Lunas',
            paidAmount: 0,
            isArrearSettledLater: true,
            settlementMonth: settlementLabel,
            paidDate: paidDateStr,
            updatedAt: new Date().toISOString(),
          };
          nextPeriodHist[pLabel] = { ...nextPeriodHist[pKey] };
          settledIuranLabels.push(pLabel);
          const pDet = targetRecap.periodsDetail.find((d) => d.periodLabel === pLabel);
          rem -= pDet?.unpaidAmount || nominal;
        }
      }
    }

    if (options.settleBaksos && targetRecap?.unpaidPastBaksosPeriods) {
      for (const bp of targetRecap.unpaidPastBaksosPeriods) {
        if (bp.pKey && (!settlementKey || bp.pKey < settlementKey)) {
          const existing = nextPeriodHist[bp.pKey] || nextPeriodHist[bp.periodLabel] || {};
          nextPeriodHist[bp.pKey] = {
            ...existing,
            baksosStatus: 'Lunas',
            paidBaksosAmount: 0,
            customBaksosFineAmount: 0,
            isBaksosSettledLater: true,
            baksosSettlementMonth: settlementLabel,
            baksosPaidDate: paidDateStr,
            updatedAt: new Date().toISOString(),
          };
          nextPeriodHist[bp.periodLabel] = { ...nextPeriodHist[bp.pKey] };
          settledBaksosLabels.push(bp.periodLabel);
        }
      }
    }

    return { nextPeriodHist, settledIuranLabels, settledBaksosLabels };
  };

  const handleResetPrev = (house: ResidentHouse) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const settlementLabel = formatMonthYearFromDate(todayStr) || config.duesCurrentMonth || currentMonthLabel;
    const targetRecap = recapList.find((r) => r.house.id === house.id);
    const prevIuranAmt = Math.max(house.previousArrears || 0, targetRecap?.previousDuesArrears || 0);
    const prevBaksosAmt = (house.previousBaksosArrears || 0) + (house.customBaksosFineAmount || 0);
    const payerName = house.duesHeadNameOverride || house.headName;

    const { nextPeriodHist, settledIuranLabels, settledBaksosLabels } = settlePastPeriodHistoryForHouse(
      house,
      settlementLabel,
      todayStr,
      {
        settleIuran: prevIuranAmt > 0,
        settleBaksos: prevBaksosAmt > 0,
        maxIuranPay: prevIuranAmt,
      }
    );

    onUpdateResident({
      ...house,
      previousArrears: 0,
      previousArrearsNote: '',
      previousBaksosArrears: 0,
      previousBaksosArrearsNote: '',
      customBaksosFineAmount: 0,
      periodHistory: nextPeriodHist,
    });

    if (prevIuranAmt > 0) {
      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Pembayaran Tunggakan',
        description: `Pelunasan Tunggakan Iuran Sebelumnya${
          settledIuranLabels.length > 0 ? ` (${settledIuranLabels.join(', ')})` : ''
        } Blok ${house.blockNumber} (${payerName})`,
        amount: prevIuranAmt,
      });
    }

    if (prevBaksosAmt > 0) {
      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Denda Baksos',
        description: `Pelunasan Denda Baksos Lalu${
          settledBaksosLabels.length > 0 ? ` [${settledBaksosLabels.join(', ')}]` : ''
        } Blok ${house.blockNumber} (${payerName})`,
        amount: prevBaksosAmt,
      });
    }

    if (prevIuranAmt + prevBaksosAmt > 0) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const handleOpenPartialPay = (item: typeof arrearsList[0]) => {
    setPartialPayItem(item);
    setPartialAmount(Math.min(25000, item.totalArrears));
    setPartialNote('');
  };

  const handleSavePartialPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partialPayItem) return;

    const payVal = Math.max(0, Number(partialAmount) || 0);
    if (payVal <= 0) return;

    let remainingPayment = payVal;
    const house: ResidentHouse = { ...partialPayItem.house };
    const todayStr = new Date().toISOString().slice(0, 10);
    const settlementLabel = formatMonthYearFromDate(todayStr) || config.duesCurrentMonth || currentMonthLabel;
    const payerName = house.duesHeadNameOverride || house.headName;

    // 1. Potong Tunggakan Bulan / Tahun Lalu terlebih dahulu (tandai bulan tertunggak Lunas Rp 0)
    const totalPrevDues = Math.max(house.previousArrears || 0, partialPayItem.previousArrears || 0);
    if (remainingPayment > 0 && totalPrevDues > 0) {
      const deductPrev = Math.min(remainingPayment, totalPrevDues);
      house.previousArrears = Math.max(0, (house.previousArrears || 0) - deductPrev);
      remainingPayment -= deductPrev;

      const { nextPeriodHist, settledIuranLabels } = settlePastPeriodHistoryForHouse(
        house,
        settlementLabel,
        todayStr,
        { settleIuran: true, maxIuranPay: deductPrev }
      );
      house.periodHistory = nextPeriodHist;

      if (house.previousArrears === 0 && settledIuranLabels.length >= (partialPayItem.unpaidPastPeriods?.length || 0)) {
        house.previousArrearsNote = '';
      }

      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Pembayaran Tunggakan',
        description: `Cicilan / Pembayaran Tunggakan Lalu${
          settledIuranLabels.length > 0 ? ` (${settledIuranLabels.join(', ')})` : ''
        } Blok ${house.blockNumber} (${payerName})${partialNote ? ` - ${partialNote}` : ''}`,
        amount: deductPrev,
      });
    }

    // 1b. Potong Tunggakan Denda Baksos Lalu
    const currentPrevBaksos = house.previousBaksosArrears || 0;
    if (remainingPayment > 0 && currentPrevBaksos > 0) {
      const deductBaksosPrev = Math.min(remainingPayment, currentPrevBaksos);
      house.previousBaksosArrears = currentPrevBaksos - deductBaksosPrev;
      remainingPayment -= deductBaksosPrev;

      const { nextPeriodHist, settledBaksosLabels } = settlePastPeriodHistoryForHouse(
        house,
        settlementLabel,
        todayStr,
        { settleBaksos: true }
      );
      house.periodHistory = nextPeriodHist;
      if (house.previousBaksosArrears === 0) {
        house.previousBaksosArrearsNote = '';
      }

      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Denda Baksos',
        description: `Cicilan / Pembayaran Denda Baksos Lalu${
          settledBaksosLabels.length > 0 ? ` [${settledBaksosLabels.join(', ')}]` : ''
        } Blok ${house.blockNumber} (${payerName})${partialNote ? ` - ${partialNote}` : ''}`,
        amount: deductBaksosPrev,
      });
    }

    // 2. Hitung agenda Denda Baksos berjalan/lalu yang tercover oleh sisa pembayaran (eksekusi onMarkFinePaid SETELAH onUpdateResident agar periodHistory tidak tertimpa)
    const agendasToMarkPaid: BaksosAgenda[] = [];
    if (remainingPayment >= 10000 && partialPayItem.unpaidBaksosList.length > 0) {
      for (const agenda of partialPayItem.unpaidBaksosList) {
        if (remainingPayment >= 10000) {
          agendasToMarkPaid.push(agenda);
          remainingPayment -= 10000;
        }
      }
      if (agendasToMarkPaid.length >= partialPayItem.unpaidBaksosList.length) {
        house.customBaksosFineAmount = 0;
      }
    }

    // 3. Potong Iuran Bulan Berjalan & Hitung Kelebihan Bayar (jika masih ada sisa setelah tunggakan & baksos)
    if (remainingPayment > 0) {
      const nominal = partialPayItem.houseMonthlyNominal;
      const alreadyPaidThisMonth =
        house.duesStatus === 'Lunas' || house.duesStatus === 'Bayar Lebih'
          ? nominal + (house.duesPrepaidBalance || 0)
          : house.duesPaidAmount || 0;
      const totalAccumulated = alreadyPaidThisMonth + remainingPayment;

      if (totalAccumulated > nominal) {
        const extraBalance = totalAccumulated - nominal;
        const estimatedMonths = Math.max(2, Math.floor(totalAccumulated / (nominal || 50000)));
        const coveredList = getSubsequentMonthLabels(config.duesCurrentMonth || 'Oktober 2026', estimatedMonths);
        house.duesStatus = 'Bayar Lebih';
        house.duesPaidAmount = 0;
        house.duesPaidMonths = estimatedMonths;
        house.duesPrepaidBalance = extraBalance;
        house.duesPaidDate = todayStr;
        house.duesMonthNote = coveredList.join(', ');
      } else if (totalAccumulated === nominal) {
        house.duesStatus = 'Lunas';
        house.duesPaidAmount = 0;
        house.duesPaidMonths = 1;
        house.duesPrepaidBalance = 0;
        house.duesPaidDate = todayStr;
      } else {
        house.duesStatus = 'Belum Bayar';
        house.duesPaidAmount = totalAccumulated;
        house.duesPaidDate = todayStr;
      }

      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Iuran Warga',
        description:
          totalAccumulated > nominal
            ? `Pembayaran Iuran & Lebih Bayar Blok ${house.blockNumber} (${payerName})${
                partialNote ? ` - ${partialNote}` : ''
              }`
            : `Pembayaran Iuran Blok ${house.blockNumber} (${payerName})${
                partialNote ? ` - ${partialNote}` : ''
              }`,
        amount: remainingPayment,
      });
    }

    // Simpan house terlebih dahulu sebelum onMarkFinePaid agar markBaksosFinePaid melapisi periodHistory secara aman
    onUpdateResident(house);

    agendasToMarkPaid.forEach((agenda) => {
      onMarkFinePaid(agenda.id, house.id, payerName, house.blockNumber);
    });

    setPartialPayItem(null);

    try {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
    } catch {}
  };

  const handlePayAllArrears = (item: typeof arrearsList[0]) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const settlementLabel = formatMonthYearFromDate(todayStr) || config.duesCurrentMonth || currentMonthLabel;
    const payerName = item.house.duesHeadNameOverride || item.house.headName;

    const { nextPeriodHist, settledIuranLabels, settledBaksosLabels } = settlePastPeriodHistoryForHouse(
      item.house,
      settlementLabel,
      todayStr,
      {
        settleIuran: item.previousArrears > 0,
        settleBaksos: item.previousBaksosArrears > 0 || (item.house.customBaksosFineAmount || 0) > 0,
        maxIuranPay: item.previousArrears,
      }
    );

    if (item.duesArrears > 0) {
      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Iuran Warga',
        description: `Pelunasan Iuran Bulanan (${currentMonthLabel}) Blok ${item.house.blockNumber} (${payerName})`,
        amount: item.duesArrears,
      });
    }

    if (item.previousArrears > 0) {
      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Pembayaran Tunggakan',
        description: `Pelunasan Tunggakan Iuran Sebelumnya${
          settledIuranLabels.length > 0 ? ` (${settledIuranLabels.join(', ')})` : ''
        } Blok ${item.house.blockNumber} (${payerName})`,
        amount: item.previousArrears,
      });
    }

    if (item.previousBaksosArrears > 0) {
      onAddTransaction({
        date: todayStr,
        type: 'masuk',
        pool: 'Kas Utama',
        category: 'Denda Baksos',
        description: `Pelunasan Tunggakan Denda Baksos Sebelumnya${
          settledBaksosLabels.length > 0 ? ` [${settledBaksosLabels.join(', ')}]` : ''
        } Blok ${item.house.blockNumber} (${payerName})${
          item.previousBaksosArrearsNote ? ` - ${item.previousBaksosArrearsNote}` : ''
        }`,
        amount: item.previousBaksosArrears,
      });
    }

    // Simpan perubahan data rumah & periodHistory terlebih dahulu sebelum onMarkFinePaid
    onUpdateResident({
      ...item.house,
      duesStatus: item.duesArrears > 0 ? 'Lunas' : item.house.duesStatus,
      duesPaidAmount: item.duesArrears > 0 ? 0 : item.house.duesPaidAmount,
      duesPaidDate: item.duesArrears > 0 ? todayStr : item.house.duesPaidDate,
      previousArrears: 0,
      previousArrearsNote: '',
      previousBaksosArrears: 0,
      previousBaksosArrearsNote: '',
      customBaksosFineAmount: 0,
      periodHistory: nextPeriodHist,
    });

    item.unpaidBaksosList.forEach((agenda) => {
      onMarkFinePaid(agenda.id, item.house.id, payerName, item.house.blockNumber);
    });

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    } catch {}
  };

  const handleCopyText = (text: string, setCopied: (val: boolean) => void) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWAReminder = (item: typeof arrearsList[0]) => {
    if (!isAdmin) return;
    setSingleBillingHouse(item);
  };

  const handleShareSummaryWA = () => {
    if (!isAdmin) return;
    let text =
      `📋 *REKAP DAFTAR TUNGGAKAN WARGA GANG MANDOR*\n` +
      `Total Tertunggak: *${formatRupiah(totalAllArrears)}* (${housesWithArrears.length} Rumah)\n\n`;

    housesWithArrears.forEach((item) => {
      const payerName = item.house.duesHeadNameOverride || item.house.headName;
      const note = item.previousArrearsNote ? ` — Ket: ${item.previousArrearsNote}` : '';
      text += `• Blok ${item.house.blockNumber} (${payerName}): ${formatRupiah(item.totalArrears)}${note}\n`;
    });

    text +=
      `\n────────────────────\n` +
      `💳 *Rekening Pembayaran Bendahara:* ${TREASURER_BANK.bankName} ${TREASURER_BANK.accountNumber} a.n. ${TREASURER_BANK.accountName}\n` +
      `_Mohon kerja sama warga untuk tertib administrasi demi kemajuan bersama._`;
    openWhatsAppShare(text);
  };

  const billableHouses = useMemo(
    () =>
      housesWithArrears.filter(
        (item) => item.house.phone && item.house.phone.replace(/[^0-9]/g, '').length >= 7
      ),
    [housesWithArrears]
  );

  const unbillableHouses = useMemo(
    () =>
      housesWithArrears.filter(
        (item) => !item.house.phone || item.house.phone.replace(/[^0-9]/g, '').length < 7
      ),
    [housesWithArrears]
  );

  const generateSingleBillingMessage = (item: typeof arrearsList[0]) => {
    const payerName = item.house.duesHeadNameOverride || item.house.headName;
    const monthStr = item.house.duesMonthNote || config.duesCurrentMonth || 'Bulan Berjalan';
    return renderArrearsSingleWhatsAppMessage({
      template: config.waArrearsMessageTemplate,
      payerName,
      blockNumber: item.house.blockNumber,
      monthStr,
      duesArrears: item.duesArrears,
      baksosFineArrears: item.baksosFineArrears,
      previousArrears: item.previousArrears,
      totalArrears: item.totalArrears,
      previousArrearsNote: item.previousArrearsNote,
      previousBaksosArrearsNote: item.previousBaksosArrearsNote,
      bankName: bankInfo ? bankInfo.split(' ')[0] || TREASURER_BANK.bankName : TREASURER_BANK.bankName,
      accountNumber: TREASURER_BANK.accountNumber,
      accountName: `${TREASURER_BANK.accountName} (${TREASURER_BANK.role})`,
      bankPhone: TREASURER_BANK.phone,
      brandName: config.brandName || config.title || 'Warga Gang Mandor Blok K2/25 - K3/24',
    });
  };

  const generateFullGroupBroadcast = () => {
    const monthStr = config.duesCurrentMonth || 'Oktober 2026';
    let formattedList = '';
    housesWithArrears.forEach((item, idx) => {
      const payerName = item.house.duesHeadNameOverride || item.house.headName;
      const details = [];
      if (item.duesArrears > 0) details.push(`Iuran: ${formatRupiah(item.duesArrears)}`);
      if (item.baksosFineArrears > 0) details.push(`Denda: ${formatRupiah(item.baksosFineArrears)}`);
      if (item.previousArrears > 0) details.push(`Lalu: ${formatRupiah(item.previousArrears)}`);
      const detailStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      formattedList += `${idx + 1}. *Blok ${item.house.blockNumber}* - ${payerName}: *${formatRupiah(item.totalArrears)}*${detailStr}\n`;
    });

    return renderArrearsBroadcastWhatsAppMessage({
      template: config.waArrearsBroadcastTemplate,
      brandName: config.brandName || config.title || 'Gang Mandor Blok K2/25 s/d K3/24',
      monthStr,
      totalAllArrears,
      housesCount: housesWithArrears.length,
      housesListFormatted: formattedList.trim(),
      bankName: TREASURER_BANK.bankName,
      accountNumber: TREASURER_BANK.accountNumber,
      accountName: `${TREASURER_BANK.accountName} (${TREASURER_BANK.role})`,
      bankPhone: TREASURER_BANK.phone,
    });
  };

  // Timer auto-sender runner
  useEffect(() => {
    let timer: any = null;
    if (isRunnerActive && isBatchBillingModalOpen && billableHouses.length > 0) {
      if (runnerIndex >= billableHouses.length) {
        setIsRunnerActive(false);
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch {}
        return;
      }

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            const target = billableHouses[runnerIndex];
            if (target) {
              const msg = generateSingleBillingMessage(target);
              openWhatsAppShare(msg, target.house.phone);
              setSentHouseIds((old) => ({ ...old, [target.house.id]: true }));
            }

            if (runnerIndex + 1 < billableHouses.length) {
              setRunnerIndex((r) => r + 1);
              return runnerDelay;
            } else {
              setIsRunnerActive(false);
              try {
                confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
              } catch {}
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    isRunnerActive,
    isBatchBillingModalOpen,
    runnerIndex,
    billableHouses,
    runnerDelay,
    bankInfo,
    deadlineNote,
    config.duesCurrentMonth,
  ]);

  const handleSendCurrentAndNext = () => {
    if (runnerIndex >= billableHouses.length) return;
    const target = billableHouses[runnerIndex];
    const msg = generateSingleBillingMessage(target);
    openWhatsAppShare(msg, target.house.phone);
    setSentHouseIds((old) => ({ ...old, [target.house.id]: true }));

    if (runnerIndex + 1 < billableHouses.length) {
      setRunnerIndex(runnerIndex + 1);
      setCountdown(runnerDelay);
    } else {
      setIsRunnerActive(false);
      try {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleCopyBroadcastText = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedBroadcast(true);
      setTimeout(() => setCopiedBroadcast(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedBroadcast(true);
      setTimeout(() => setCopiedBroadcast(false), 2500);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* Top Banner Overview with Options Below Description */}
      <div className="bg-gradient-to-r from-rose-50/90 via-orange-50/70 to-amber-50/80 dark:from-slate-900 dark:via-rose-950/50 dark:to-amber-950/40 rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-xs space-y-3">
        {/* Row 1: Judul & Deskripsi Penuh */}
        <div>
          {(config.arrearsSectionTitle ?? 'Ringkasan Rekapitulasi Daftar Tunggakan Warga') && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-600 text-white rounded-xl shadow-xs shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {config.arrearsSectionTitle !== undefined
                  ? config.arrearsSectionTitle
                  : 'Ringkasan Rekapitulasi Daftar Tunggakan Warga'}
              </h2>
            </div>
          )}
          {(config.arrearsSectionDescription ??
            'Data tunggakan bersumber otomatis dari integrasi belum bayar iuran kas, denda baksos (Rp 10.000/ketidakhadiran), serta tunggakan bulan/tahun sebelumnya beserta keterangannya.') && (
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl mt-2 leading-relaxed">
              {config.arrearsSectionDescription !== undefined
                ? config.arrearsSectionDescription
                : 'Data tunggakan bersumber otomatis dari integrasi belum bayar iuran kas, denda baksos (Rp 10.000/ketidakhadiran), serta tunggakan bulan/tahun sebelumnya beserta keterangannya.'}
            </p>
          )}
        </div>

        {/* Row 2: Pilihan / Tombol Aksi Berada di Bawah Deskripsi */}
        {isAdmin && (
          <div className="pt-3 border-t border-rose-200/70 dark:border-rose-900/60 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                exportFinancialReportToExcel({
                  config,
                  transactions,
                  residents,
                  baksosAgendas,
                  balances,
                  exportScope: 'all',
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title="Download Excel (.xlsx) Semua Laporan Keuangan & Rincian Tunggakan"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
              <span>Export Excel Keuangan & Tunggakan</span>
            </button>


            {/* Tombol Utama: Penarikan Tagihan Otomatis Massal via WhatsApp (Semua Warga Sekaligus) */}
            <button
              type="button"
              onClick={() => {
                setIsBatchBillingModalOpen(true);
                setBatchBillingTab('runner');
                setRunnerIndex(0);
                setIsRunnerActive(false);
                setCountdown(runnerDelay);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap min-h-[38px] ring-2 ring-emerald-300"
              title="Tarik Tagihan Otomatis Sekaligus via WhatsApp (Semua Warga)"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>⚡ Tarik Tagihan Otomatis Massal ({housesWithArrears.length})</span>
            </button>

            {/* Tombol Kustomisasi / Edit Template Pesan WhatsApp Penagihan */}
            <button
              type="button"
              onClick={() => setIsWaTemplateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-emerald-900 border-2 border-emerald-400 rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap min-h-[38px] hover:border-emerald-600 active:scale-95"
              title="Edit Format Template Pesan WhatsApp Penagihan Tunggakan Per KK & Broadcast Grup"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Edit Template Pesan WA</span>
            </button>

            <button
              type="button"
              onClick={handleShareSummaryWA}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Rekap Tagihan ke WA</span>
            </button>

            {onOpenConfigModal && (
              <button
                type="button"
                onClick={onOpenConfigModal}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer ml-auto"
                title="Edit / Hapus Judul & Deskripsi Tunggakan"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Colorful Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-rose-600/15">
          <span className="text-[11px] font-semibold text-rose-100 uppercase tracking-wider block">
            Total Seluruh Tunggakan
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-mono tracking-tight tabular-nums">
            {formatRupiah(totalAllArrears)}
          </div>
          <span className="text-[11px] text-rose-100 mt-0.5 block">
            Dari {housesWithArrears.length} rumah yang memiliki tanggungan
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-amber-500/15">
          <span className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider block">
            Tunggakan Iuran Bulan Ini ({currentMonthLabel})
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-mono tracking-tight tabular-nums">
            {formatRupiah(
              arrearsList.reduce((acc, curr) => acc + curr.duesArrears, 0)
            )}
          </div>
          <span className="text-[11px] text-amber-100 mt-0.5 block">
            {arrearsList.filter((a) => a.duesArrears > 0).length} rumah belum lunas iuran {currentMonthLabel}
          </span>
        </div>

        <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-800 text-white p-3.5 sm:p-4 rounded-2xl shadow-md shadow-purple-600/15">
          <span className="text-[11px] font-semibold text-purple-100 uppercase tracking-wider block">
            Denda Baksos & Tunggakan Lalu
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-mono tracking-tight tabular-nums">
            {formatRupiah(
              arrearsList.reduce(
                (acc, curr) => acc + curr.baksosFineArrears + curr.previousArrears,
                0
              )
            )}
          </div>
          <span className="text-[11px] text-purple-100 mt-0.5 block">
            Akumulasi denda baksos & sisa bulan/tahun lalu
          </span>
        </div>
      </div>

      {/* Arrears Detailed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-800/60 overflow-hidden shadow-md">
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/20 text-white shrink-0">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Daftar Rincian Tunggakan Per Rumah (Blok K2/25 - K3/24)
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-amber-100 font-medium">
                <span className="font-bold text-amber-300">Bulan Berjalan: {currentMonthLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{housesWithArrears.length} Rumah Menunggak</span>
                <span className="hidden lg:inline" aria-hidden="true">·</span>
                <span className="hidden lg:inline">Tersinkronisasi dengan Rekap Kas Per KK</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Cari blok / warga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-white/40 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-2xs w-44 sm:w-52"
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode 1: Mobile Card View for Handphones (Zero horizontal table squeeze) */}
        <div className="md:hidden divide-y divide-rose-200/80">
          {filteredDelinquentList.length === 0 ? (
            <div className="p-8 text-center bg-white/70 text-slate-600 font-medium text-xs">
              🎉 Tidak ada data warga yang menunggak {searchQuery ? 'dengan kata kunci pencarian ini' : '(Seluruh KK Tertib & Lunas)'}.
            </div>
          ) : (
            filteredDelinquentList.map((item, idx) => {
              const isVacant = isHouseVacant(item.house) || item.house.occupancy === 'Kosong';
              const hasDebt = item.totalArrears > 0;
              const paidPartialDues = item.house.duesPaidAmount || 0;
              const payerName = isVacant
                ? (item.house.duesHeadNameOverride && item.house.duesHeadNameOverride.toLowerCase().includes('kosong')
                    ? item.house.duesHeadNameOverride
                    : 'Rumah Kosong')
                : (item.house.headName?.trim() || item.house.duesHeadNameOverride || '-');
              const duesNote = item.previousArrearsNote || item.house.previousArrearsNote || '';

              return (
                <div
                  key={item.house.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isVacant
                      ? 'bg-slate-100/95 text-slate-600 border border-slate-300 rounded-xl my-1'
                      : hasDebt
                      ? 'bg-rose-50/40'
                      : 'bg-white/80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs shadow-2xs ${
                          isVacant ? 'bg-slate-400 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        Blok {item.house.blockNumber}
                      </span>
                      <div>
                        <h4
                          className={`font-extrabold text-sm leading-tight flex flex-wrap items-center gap-1.5 ${
                            isVacant ? 'text-slate-700 italic' : 'text-slate-900'
                          }`}
                        >
                          <span>{payerName}</span>
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {item.house.ownership} · {isVacant ? 'Kosong (Tanpa Penghuni)' : item.house.occupancy}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          isVacant
                            ? 'bg-slate-200 text-slate-700 border border-slate-300'
                            : hasDebt
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isVacant ? 'Kosong (Bebas Iuran)' : hasDebt ? 'Tertunggak' : 'Lunas'}
                      </span>
                      <div className="mt-1 font-mono font-black text-sm tabular-nums">
                        {hasDebt ? (
                          <div>
                            <span className="text-rose-700">{formatRupiah(item.totalArrears)}</span>
                            {item.baksosFineArrears > 0 && (
                              <span className="block text-[10px] font-sans font-bold text-amber-800">
                                (Termasuk Denda 10 Ribu)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-emerald-700">Rp 0</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Arrears Breakdown Grid */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">
                        Iuran Bulan Ini ({currentMonthLabel}):
                      </span>
                      {item.house.occupancy === 'Kosong' ? (
                        <span className="text-slate-400 italic text-[11px]">Kosong</span>
                      ) : item.duesArrears > 0 ? (
                        <div>
                          <strong className="text-rose-600 font-mono">
                            {formatRupiah(item.duesArrears)}
                          </strong>
                          {paidPartialDues > 0 && (
                            <span className="block text-[10px] text-amber-700">
                              (Cicil {formatRupiah(paidPartialDues)})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-medium">Rp 0 (Lunas)</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px] block font-semibold">Denda Baksos:</span>
                      </div>
                      {item.baksosFineArrears > 0 ? (
                        <div className="mt-0.5">
                          <strong className="text-amber-700 font-mono font-black block">
                            {formatRupiah(item.baksosFineArrears)}
                          </strong>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded font-sans text-[10px] font-bold shadow-2xs">
                            Denda 10 Ribu (Tidak Hadir)
                          </span>
                          {item.unpaidBaksosList && item.unpaidBaksosList.length > 0 ? (
                            <span className="block text-[10px] text-slate-600 font-semibold leading-tight mt-0.5">
                              (Agenda: {item.unpaidBaksosList.map((a: any) => a.title || 'Baksos').join(', ')})
                            </span>
                          ) : item.previousBaksosArrearsNote ? (
                            <span className="block text-[10px] text-slate-500 italic">
                              ({item.previousBaksosArrearsNote})
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-400">Rp 0</span>
                      )}
                    </div>

                    <div className="col-span-2 pt-1.5 border-t border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-slate-500 text-[11px]">Tunggakan Lalu:</span>{' '}
                          <strong
                            className={
                              item.previousArrears > 0
                                ? 'text-rose-700 font-mono'
                                : 'text-slate-400 font-mono'
                            }
                          >
                            {formatRupiah(item.previousArrears)}
                          </strong>
                        </div>
                      </div>

                      {duesNote ? (
                        <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 leading-relaxed shadow-2xs">
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-start gap-1.5 flex-1 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-rose-800 block uppercase tracking-wider">
                                  Keterangan Tunggakan Lalu:
                                </span>
                                <p className="font-semibold text-slate-800 whitespace-normal break-words mt-0.5 select-text">
                                  {duesNote}
                                </p>
                              </div>
                            </div>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditArrears(item.house, duesNote, item.previousArrears)}
                                className="p-1 rounded-md text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                                title="Edit Keterangan Tunggakan Lalu (tersinkronisasi ke Tabel Rekap Pembayaran Iuran Per KK)"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : isAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleOpenEditArrears(item.house, '', item.previousArrears)}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 border border-dashed border-amber-300 text-amber-800 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-amber-600" />
                          <span>+ Isi Keterangan Tunggakan Lalu</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Admin Touch Actions on Handphone */}
                  {isAdmin && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {hasDebt && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSendWAReminder(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer min-h-[38px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Tagih WA</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenPartialPay(item)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer min-h-[38px]"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Cicil</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePayAllArrears(item)}
                            className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer min-h-[38px]"
                          >
                            Lunaskan
                          </button>
                        </>
                      )}
                      {(item.previousArrears > 0 || (item.previousBaksosArrears || 0) > 0) && (
                        <button
                          type="button"
                          onClick={() => handleResetPrev(item.house)}
                          className="py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
                          title="Hapus Tunggakan Bulan Lalu & Denda"
                        >
                          Hapus Lalu
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }))}
        </div>

        {/* View Mode 2: Compact 1-Page Desktop & Tablet Table (>= 768px, Zero Horizontal Overflow) */}
        <div className="hidden md:block overflow-x-auto lg:overflow-x-visible">
          <table className="w-full table-auto text-left text-[11px] lg:text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold leading-tight">
                <th className="py-2 px-1.5 w-8 text-center">No</th>
                <th className="py-2 px-2 w-16 whitespace-nowrap">Blok</th>
                <th className="py-2 px-2 min-w-[115px] max-w-[160px]">Kepala Keluarga</th>
                <th className="py-2 px-2 w-[92px] text-right whitespace-nowrap">
                  <span className="block">Iuran</span>
                  <span className="block text-[10px] font-semibold text-slate-500">{currentMonthLabel}</span>
                </th>
                <th className="py-2 px-2 w-[88px] text-right whitespace-nowrap">
                  <span className="block">Tunggakan</span>
                  <span className="block text-[10px] font-semibold text-slate-500">Bln/Thn Lalu</span>
                </th>
                <th className="py-2 px-2.5 min-w-[155px]">Ket. Tunggakan Lalu</th>
                <th className="py-2 px-2 w-[112px] text-right whitespace-nowrap">
                  <span className="block">Denda</span>
                  <span className="block text-[10px] font-semibold text-slate-500">Baksos</span>
                </th>
                <th className="py-2 px-2 w-[108px] text-right whitespace-nowrap">
                  <span className="block">Total &</span>
                  <span className="block text-[10px] font-semibold text-slate-500">Status</span>
                </th>
                {isAdmin && (
                  <th className="py-2 px-2 w-[138px] text-center whitespace-nowrap">
                    Aksi Pengurus
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDelinquentList.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 8}
                    className="py-8 text-center text-slate-500 font-medium bg-white/60"
                  >
                    🎉 Tidak ada data warga yang menunggak {searchQuery ? 'dengan kata kunci pencarian ini' : '(Seluruh KK Tertib & Lunas)'}.
                  </td>
                </tr>
              ) : (
                filteredDelinquentList.map((item, idx) => {
                  const isVacant = isHouseVacant(item.house) || item.house.occupancy === 'Kosong';
                  const hasDebt = item.totalArrears > 0;
                  const paidPartialDues = item.house.duesPaidAmount || 0;
                  const payerName = isVacant
                    ? (item.house.duesHeadNameOverride && item.house.duesHeadNameOverride.toLowerCase().includes('kosong')
                        ? item.house.duesHeadNameOverride
                        : 'Rumah Kosong')
                    : (item.house.headName?.trim() || item.house.duesHeadNameOverride || '-');
                  const duesNote = item.previousArrearsNote || item.house.previousArrearsNote || '';
                  const agendaTitles =
                    item.unpaidBaksosList && item.unpaidBaksosList.length > 0
                      ? item.unpaidBaksosList.map((a: any) => a.title || 'Baksos').join(', ')
                      : '';

                  return (
                    <tr
                      key={item.house.id}
                      className={`group transition-colors ${
                        isVacant
                          ? 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/50'
                          : hasDebt
                          ? 'bg-white hover:bg-rose-50/50'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-1.5 text-center text-slate-400 font-mono tabular-nums align-middle">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-2 font-bold font-mono whitespace-nowrap align-middle">
                        <span
                          className={
                            isVacant
                              ? 'px-1.5 py-0.5 rounded bg-slate-400 text-white text-[11px]'
                              : 'text-emerald-800'
                          }
                        >
                          {item.house.blockNumber}
                        </span>
                      </td>
                      <td
                        className={`py-2 px-2 font-semibold leading-snug break-words align-middle ${
                          isVacant ? 'text-slate-600 italic' : 'text-slate-800'
                        }`}
                      >
                        {payerName}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap align-middle">
                        {item.house.occupancy === 'Kosong' ? (
                          <span className="text-slate-400 italic text-[10px]">Kosong</span>
                        ) : item.duesArrears > 0 ? (
                          <div>
                            <span className="text-rose-600 font-semibold">
                              {formatRupiah(item.duesArrears)}
                            </span>
                            {paidPartialDues > 0 && (
                              <span className="block text-[10px] font-sans text-amber-700 leading-tight">
                                Cicil {formatRupiah(paidPartialDues)}
                              </span>
                            )}
                          </div>
                        ) : item.house.duesStatus === 'Bayar Lebih' ? (
                          <span className="text-indigo-700 font-bold text-[11px]">
                            Rp 0 <span className="font-sans font-medium text-[10px]">(Lebih)</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">
                            Rp 0 <span className="font-sans text-[10px]">(Lunas)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap align-middle">
                        <span
                          className={
                            item.previousArrears > 0
                              ? 'text-rose-700 font-bold'
                              : 'text-slate-400'
                          }
                        >
                          {formatRupiah(item.previousArrears)}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 whitespace-normal break-words leading-snug align-middle">
                        {duesNote ? (
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-[11px] font-medium text-slate-700 break-words select-text">
                              {duesNote}
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditArrears(item.house, duesNote, item.previousArrears)}
                                className="p-0.5 rounded text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer shrink-0 opacity-50 group-hover:opacity-100"
                                title="Edit Keterangan Tunggakan Lalu (tersinkronisasi ke Tabel Rekap Pembayaran Iuran Per KK)"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : isAdmin ? (
                          <button
                            type="button"
                            onClick={() => handleOpenEditArrears(item.house, '', item.previousArrears)}
                            className="text-amber-700 hover:text-amber-900 hover:underline text-[11px] font-medium inline-flex items-center gap-1 transition-colors cursor-pointer opacity-75 hover:opacity-100"
                            title="Tambah Keterangan Tunggakan Lalu KK ini"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>+ Ket.</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">-</span>
                        )}
                      </td>
                      {/* Denda Baksos Column */}
                      <td className="py-2 px-2 text-right font-mono tabular-nums align-middle">
                        <span
                          className={`whitespace-nowrap ${
                            item.baksosFineArrears > 0
                              ? 'text-amber-800 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {formatRupiah(item.baksosFineArrears)}
                        </span>
                        {item.baksosFineArrears > 0 && (
                          <div className="font-sans leading-tight mt-0.5">
                            <span className="block text-[10px] font-semibold text-rose-700 whitespace-nowrap">
                              Denda 10rb · Tidak Hadir
                            </span>
                            {agendaTitles ? (
                              <span
                                className="block text-[10px] text-slate-500 max-w-[110px] truncate ml-auto"
                                title={`Agenda: ${agendaTitles}`}
                              >
                                {agendaTitles}
                              </span>
                            ) : item.previousBaksosArrearsNote ? (
                              <span
                                className="block text-[10px] text-slate-500 italic max-w-[110px] truncate ml-auto"
                                title={item.previousBaksosArrearsNote}
                              >
                                {item.previousBaksosArrearsNote}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right font-mono tabular-nums whitespace-nowrap align-middle">
                        {hasDebt ? (
                          <div>
                            <span className="text-rose-700 font-black text-xs lg:text-[13px]">
                              {formatRupiah(item.totalArrears)}
                            </span>
                            <span className="block font-sans text-[10px] font-bold text-rose-600 leading-tight">
                              Tertunggak{item.baksosFineArrears > 0 ? ' · +Denda' : ''}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-emerald-700 font-black">Rp 0</span>
                            <span className="block font-sans text-[10px] font-bold text-emerald-700 leading-tight">
                              Lunas
                            </span>
                          </div>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="py-2 px-2 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center gap-1">
                            {hasDebt && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSendWAReminder(item)}
                                  className="inline-flex items-center gap-1 px-1.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                                  title="Kirim Tagihan WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                                  <span>WA</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenPartialPay(item)}
                                  className="inline-flex items-center gap-0.5 px-1.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                                  title="Bayar Sebagian / Cicil Tunggakan Rumah Ini"
                                >
                                  <span>Cicil</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePayAllArrears(item)}
                                  className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                                  title="Lunaskan Seluruh Tunggakan & Masukkan ke Kas"
                                >
                                  Lunas
                                </button>
                              </>
                            )}
                            {(item.previousArrears > 0 || (item.previousBaksosArrears || 0) > 0) && (
                              <button
                                type="button"
                                onClick={() => handleResetPrev(item.house)}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Hapus Tunggakan Bulan Lalu & Denda"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                }))}
            </tbody>
            {filteredDelinquentList.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100/95 border-t-2 border-slate-200 text-slate-900 font-bold text-[11px] lg:text-xs">
                  <td colSpan={3} className="py-2.5 px-2.5 text-right">
                    Total ({filteredDelinquentList.length} Rumah):
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums text-rose-700 whitespace-nowrap">
                    {formatRupiah(filteredDelinquentList.reduce((s, r) => s + r.duesArrears, 0))}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums text-rose-700 whitespace-nowrap">
                    {formatRupiah(filteredDelinquentList.reduce((s, r) => s + r.previousArrears, 0))}
                  </td>
                  <td className="py-2.5 px-2.5 text-slate-500 font-normal text-[10px]">
                    Akumulasi komponen tertunggak
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums text-amber-800 whitespace-nowrap">
                    {formatRupiah(filteredDelinquentList.reduce((s, r) => s + r.baksosFineArrears, 0))}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono tabular-nums font-black text-rose-700 whitespace-nowrap">
                    {formatRupiah(filteredDelinquentList.reduce((s, r) => s + r.totalArrears, 0))}
                  </td>
                  {isAdmin && <td className="py-2.5 px-2" />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal Pembayaran Sebagian (Cicilan) Tunggakan Per Rumah */}
      {partialPayItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">
                  Pembayaran Sebagian (Cicil) Tunggakan
                </h4>
                <p className="text-[11px] text-amber-100">
                  Blok {partialPayItem.house.blockNumber} — {partialPayItem.house.headName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPartialPayItem(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePartialPay} className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tunggakan Bulan/Tahun Lalu:</span>
                  <span className="font-mono font-semibold">
                    {formatRupiah(partialPayItem.previousArrears)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Denda Bakti Sosial:</span>
                  <span className="font-mono font-semibold">
                    {formatRupiah(partialPayItem.baksosFineArrears)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sisa Iuran Bulan Berjalan:</span>
                  <span className="font-mono font-semibold">
                    {formatRupiah(partialPayItem.duesArrears)}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-amber-200 flex justify-between font-bold text-slate-900">
                  <span>Total Tanggungan Saat Ini:</span>
                  <span className="font-mono text-rose-600">
                    {formatRupiah(partialPayItem.totalArrears)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nominal yang Dibayarkan Sekarang (Rp)
                </label>
                <input
                  type="number"
                  value={partialAmount === 0 ? '' : partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  autoFocus
                />
                {(Number(partialAmount) || 0) > partialPayItem.totalArrears ? (
                  <span className="text-[11px] text-indigo-700 font-semibold block mt-1">
                    Kelebihan bayar{' '}
                    <strong className="font-mono">
                      +{formatRupiah((Number(partialAmount) || 0) - partialPayItem.totalArrears)}
                    </strong>{' '}
                    otomatis menjadi status <strong>Bayar Lebih (Deposit Bulan Depan)</strong> & masuk ke Kas Utama.
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Sisa tunggakan setelah pembayaran ini:{' '}
                    <strong className="font-mono text-rose-600">
                      {formatRupiah(
                        Math.max(0, partialPayItem.totalArrears - (Number(partialAmount) || 0))
                      )}
                    </strong>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Pembayaran (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Cicilan tahap 1 tunai ke bendahara..."
                  value={partialNote}
                  onChange={(e) => setPartialNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPartialPayItem(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Terima & Catat ke Kas Utama
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL PENARIKAN TAGIHAN OTOMATIS MASSAL VIA WHATSAPP (BATCH AUTO-BILLING)
          ======================================================================== */}
      {isBatchBillingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => {
            setIsBatchBillingModalOpen(false);
            setIsRunnerActive(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-emerald-400 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white p-5 flex items-start justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20 text-white shadow-inner shrink-0">
                  <Zap className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg">
                      Penarikan Tagihan Otomatis Massal via WhatsApp
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                      Khusus Pengurus
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Kirim tagihan iuran kas & denda sekaligus ke seluruh warga tertunggak ({housesWithArrears.length} rumah) secara otomatis tanpa satu-satu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsBatchBillingModalOpen(false);
                  setIsRunnerActive(false);
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-3 sm:p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-200 shadow-2xs w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setBatchBillingTab('runner')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    batchBillingTab === 'runner'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>1. Auto-Sender Berurutan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBatchBillingTab('broadcast')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    batchBillingTab === 'broadcast'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>2. Broadcast Grup WA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBatchBillingTab('list')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    batchBillingTab === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>3. Checklist Cepat ({housesWithArrears.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
                <span className="text-slate-500 font-sans">Total Tunggakan:</span>
                <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
                  {formatRupiah(totalAllArrears)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Tab 1: Auto-Sender Berurutan */}
              {batchBillingTab === 'runner' && (
                <div className="space-y-5">
                  {billableHouses.length === 0 ? (
                    <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h4 className="font-extrabold text-base text-emerald-900">
                        Tidak Ada Tunggakan yang Perlu Ditagih!
                      </h4>
                      <p className="text-xs text-emerald-700">
                        Seluruh warga telah menyelesaikan kewajiban iuran kas dan denda baksos.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Overall Progress Tracker */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-emerald-600" />
                            <span>Progres Pengiriman Antrean:</span>
                          </span>
                          <span className="font-mono text-emerald-700 font-black">
                            {Object.keys(sentHouseIds).length} dari {billableHouses.length} Warga Terkirim (
                            {Math.round((Object.keys(sentHouseIds).length / billableHouses.length) * 100)}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(
                                5,
                                Math.round((Object.keys(sentHouseIds).length / billableHouses.length) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Current Target Card in Queue */}
                      {runnerIndex < billableHouses.length ? (() => {
                        const currentTarget = billableHouses[runnerIndex];
                        const isSent = !!sentHouseIds[currentTarget.house.id];
                        const currentMsg = generateSingleBillingMessage(currentTarget);

                        return (
                          <div className="rounded-2xl border-2 border-emerald-400 bg-white shadow-md overflow-hidden space-y-4 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                                  #{runnerIndex + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                                      Blok {currentTarget.house.blockNumber} — {currentTarget.house.headName}
                                    </h4>
                                    {isSent && (
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                        Sudah Dibuka/Kirim
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{currentTarget.house.phone}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[11px] text-slate-400 block">Total Tagihan</span>
                                <span className="font-mono font-black text-rose-600 text-lg">
                                  {formatRupiah(currentTarget.totalArrears)}
                                </span>
                              </div>
                            </div>

                            {/* Breakdown Pills */}
                            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
                              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                                <span className="block text-[10px] text-amber-700 font-sans">Iuran Kas:</span>
                                <strong>{formatRupiah(currentTarget.duesArrears)}</strong>
                              </div>
                              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                                <span className="block text-[10px] text-rose-700 font-sans">Denda Baksos:</span>
                                <strong>{formatRupiah(currentTarget.baksosFineArrears)}</strong>
                              </div>
                              <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-900">
                                <span className="block text-[10px] text-purple-700 font-sans">Tunggakan Lalu:</span>
                                <strong>{formatRupiah(currentTarget.previousArrears)}</strong>
                              </div>
                            </div>

                            {(() => {
                              const ctDuesNote = currentTarget.previousArrearsNote || currentTarget.house.previousArrearsNote || '';

                              if (!ctDuesNote) return null;

                              return (
                                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
                                  <div className="flex items-start gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[10px] font-bold text-rose-800 block uppercase tracking-wider">
                                        Keterangan Tunggakan Lalu:
                                      </span>
                                      <span className="font-semibold text-slate-800">{ctDuesNote}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Kartu Rekening Bendahara Resmi */}
                            <div className="rounded-2xl p-3.5 sm:p-4 text-white shadow-md border border-blue-400/40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                                    Rekening Bendahara
                                  </span>
                                  <span className="text-xs font-bold text-sky-200">Bank {TREASURER_BANK.bankName}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
                                    {TREASURER_BANK.accountNumber}
                                  </span>
                                  <span className="text-xs text-slate-200 font-semibold">a.n. {TREASURER_BANK.accountName}</span>
                                </div>
                                <span className="text-[10px] text-sky-200 block">
                                  Berita: Kas Gang - Blok {currentTarget.house.blockNumber} · Konfirmasi WA: {TREASURER_BANK.phone}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyText(TREASURER_BANK.accountNumber, setCopiedBankNumber)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs ${
                                  copiedBankNumber
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white hover:bg-sky-50 text-slate-900'
                                }`}
                                title="Salin Nomor Rekening Bendahara"
                              >
                                {copiedBankNumber ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-white" />
                                    <span>Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-blue-700" />
                                    <span>Salin No. Rek</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Message Preview Box */}
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                <span>Preview Pesan WhatsApp yang Akan Dikirim:</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyBroadcastText(currentMsg)}
                                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Salin Teks</span>
                                </button>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                                {currentMsg}
                              </div>
                            </div>

                            {/* Control Bar */}
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsRunnerActive(!isRunnerActive)}
                                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                                    isRunnerActive
                                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  }`}
                                >
                                  {isRunnerActive ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      <span>Jeda Auto-Runner ({countdown}s)</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 text-amber-300" />
                                      <span>Mulai Auto-Runner Sekaligus</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={handleSendCurrentAndNext}
                                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer whitespace-nowrap"
                                  title="Buka WhatsApp untuk warga ini dan langsung geser ke antrean berikutnya"
                                >
                                  <MessageCircle className="w-4 h-4 text-white" />
                                  <span>Kirim Sekarang & Lanjut</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                {runnerIndex + 1 < billableHouses.length && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRunnerIndex(runnerIndex + 1);
                                      setCountdown(runnerDelay);
                                    }}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer flex items-center gap-1"
                                  >
                                    <SkipForward className="w-3.5 h-3.5" />
                                    <span>Lewati Warga Ini</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRunnerIndex(0);
                                    setIsRunnerActive(false);
                                    setCountdown(runnerDelay);
                                  }}
                                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
                                  title="Ulangi dari Warga Pertama"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="p-8 text-center bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-3">
                          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                          <h4 className="font-extrabold text-base sm:text-lg text-emerald-950">
                            🎉 Seluruh Antrean Tagihan ({billableHouses.length} Rumah) Berhasil Diproses!
                          </h4>
                          <p className="text-xs text-emerald-800 max-w-md mx-auto">
                            Semua pesan tagihan telah dibuka atau dikirimkan ke WhatsApp warga. Terima kasih telah menjalankan penarikan tagihan otomatis massal.
                          </p>
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setRunnerIndex(0);
                                setIsRunnerActive(false);
                                setCountdown(runnerDelay);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Ulangi Pengiriman
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsBatchBillingModalOpen(false)}
                              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
                            >
                              Tutup Modal
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Unbillable Houses Warning (Tanpa Nomor WA) */}
                      {unbillableHouses.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Catatan {unbillableHouses.length} Rumah Tanpa Nomor WhatsApp:</strong>
                            <span className="block mt-0.5 text-amber-800">
                              {unbillableHouses
                                .map((h) => `Blok ${h.house.blockNumber} (${h.house.headName})`)
                                .join(', ')}{' '}
                              dapat ditagih manual secara tatap muka / offline oleh pengurus.
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Tab 2: Broadcast Sekaligus ke Grup WhatsApp Warga */}
              {batchBillingTab === 'broadcast' && (() => {
                const groupMsg = generateFullGroupBroadcast();
                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-cyan-900">
                          Format Pesan Rekapitulasi Tagihan Sekaligus ke Grup WA Warga
                        </h4>
                        <p className="text-cyan-800 mt-0.5">
                          Kirim 1 pesan rangkuman ke grup WhatsApp resmi warga yang memuat seluruh rincian rumah tertunggak dan petunjuk pembayaran.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyBroadcastText(groupMsg)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            copiedBroadcast
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs'
                          }`}
                        >
                          {copiedBroadcast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBroadcast ? 'Tersalin!' : 'Salin Teks'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openWhatsAppShare(groupMsg)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-white" />
                          <span>Kirim ke Grup WA</span>
                        </button>
                      </div>
                    </div>

                    {/* Rekening Bendahara Card */}
                    <div className="rounded-2xl p-4 text-white shadow-md border border-blue-400/40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wide">
                            Rekening Pembayaran
                          </span>
                          <span className="text-xs font-bold text-sky-200">Bank {TREASURER_BANK.bankName}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xl font-black text-amber-300 tracking-wider">
                            {TREASURER_BANK.accountNumber}
                          </span>
                          <span className="text-xs text-slate-200 font-semibold">a.n. {TREASURER_BANK.accountName}</span>
                        </div>
                        <span className="text-[10px] text-sky-200 block">
                          Konfirmasi WhatsApp Bendahara: {TREASURER_BANK.phone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(TREASURER_BANK.accountNumber, setCopiedBankNumber)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs ${
                          copiedBankNumber
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white hover:bg-sky-50 text-slate-900'
                        }`}
                        title="Salin Nomor Rekening Bendahara"
                      >
                        {copiedBankNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-700" />
                            <span>Salin No. Rek</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Isi Pesan Broadcast Grup (Otomatis Di-generate):
                      </label>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                        {groupMsg}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 3: Checklist Cepat Semua Tagihan */}
              {batchBillingTab === 'list' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">
                      Daftar {housesWithArrears.length} Rumah Tertunggak:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const allMap: Record<string, boolean> = {};
                        housesWithArrears.forEach((h) => {
                          allMap[h.house.id] = true;
                        });
                        setSentHouseIds(allMap);
                      }}
                      className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Tandai Semua Sudah Terkirim
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {housesWithArrears.map((item, idx) => {
                      const isSent = !!sentHouseIds[item.house.id];
                      return (
                        <div
                          key={item.house.id}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                                <span>Blok {item.house.blockNumber} — {item.house.headName}</span>
                                {isSent ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    ✓ Terkirim
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                                    Belum Dikirim
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                {item.house.phone ? `WA: ${item.house.phone}` : 'Tanpa No. WA'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <span className="font-mono font-black text-rose-600 text-sm">
                              {formatRupiah(item.totalArrears)}
                            </span>

                            {item.house.phone ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const msg = generateSingleBillingMessage(item);
                                  openWhatsAppShare(msg, item.house.phone);
                                  setSentHouseIds((old) => ({ ...old, [item.house.id]: true }));
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Kirim WA</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Offline</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rekening Transfer & Pengaturan Pembayaran */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Pengaturan Info Rekening Pembayaran Tagihan:</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setBankInfo(
                        `${TREASURER_BANK.bankName} ${TREASURER_BANK.accountNumber} a.n. ${TREASURER_BANK.accountName} (${TREASURER_BANK.role}) / Tunai ke Rumah Bendahara`
                      )
                    }
                    className="text-[11px] text-blue-700 hover:underline font-bold cursor-pointer"
                  >
                    Gunakan Rekening Resmi Bendahara (BCA {TREASURER_BANK.accountNumber})
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Rekening Bank / QRIS / Pos Kas Bendahara:
                    </label>
                    <input
                      type="text"
                      value={bankInfo}
                      onChange={(e) => setBankInfo(e.target.value)}
                      placeholder={`${TREASURER_BANK.bankName} ${TREASURER_BANK.accountNumber} a.n. ${TREASURER_BANK.accountName}`}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                ⚡ Sistem penarikan tagihan WhatsApp otomatis massal untuk pengurus Gang Mandor.
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsBatchBillingModalOpen(false);
                  setIsRunnerActive(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MODAL POP-UP PENAGIHAN TUNGGAKAN WARGA PER KK (DENGAN REKENING BENDAHARA)
          ======================================================================== */}
      {singleBillingHouse && (() => {
        const payerName =
          singleBillingHouse.house.duesHeadNameOverride || singleBillingHouse.house.headName;
        const msg = generateSingleBillingMessage(singleBillingHouse);

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSingleBillingHouse(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-emerald-400 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/20 text-white shadow-inner shrink-0">
                    <CreditCard className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg">
                        Penagihan Tunggakan Warga
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                        Blok {singleBillingHouse.house.blockNumber}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      {payerName} · {singleBillingHouse.house.ownership} ·{' '}
                      {singleBillingHouse.house.phone || 'Tanpa No. WA'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSingleBillingHouse(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {/* Rincian Tagihan */}
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Rincian Tunggakan yang Perlu Diselesaikan:</span>
                    <span className="text-rose-700 font-mono text-sm font-black">
                      {formatRupiah(singleBillingHouse.totalArrears)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-rose-200/60 font-mono">
                    <div className="p-2 rounded-xl bg-white border border-rose-100 text-center">
                      <span className="text-[10px] text-slate-500 block font-sans">Iuran ({currentMonthLabel}):</span>
                      <strong className="text-rose-700">
                        {formatRupiah(singleBillingHouse.duesArrears)}
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-rose-100 text-center">
                      <span className="text-[10px] text-slate-500 block font-sans font-semibold">Denda Baksos:</span>
                      <strong className="text-amber-700 font-mono font-bold block">
                        {formatRupiah(singleBillingHouse.baksosFineArrears)}
                      </strong>
                      {singleBillingHouse.baksosFineArrears > 0 && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 text-[9px] font-bold mt-0.5 shadow-2xs">
                          Denda 10 Ribu (Tidak Hadir)
                        </span>
                      )}
                      {singleBillingHouse.unpaidBaksosList && singleBillingHouse.unpaidBaksosList.length > 0 && (
                        <span className="block text-[9px] text-slate-600 font-semibold leading-tight mt-0.5">
                          (Agenda: {singleBillingHouse.unpaidBaksosList.map((a: any) => a.title || 'Baksos').join(', ')})
                        </span>
                      )}
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-rose-100 text-center">
                      <span className="text-[10px] text-slate-500 block font-sans">Tunggakan Lalu:</span>
                      <strong className="text-purple-700">
                        {formatRupiah(singleBillingHouse.previousArrears)}
                      </strong>
                    </div>
                  </div>
                  {(() => {
                    const sbDuesNote = singleBillingHouse.previousArrearsNote || singleBillingHouse.house.previousArrearsNote || '';

                    if (!sbDuesNote) return null;

                    return (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                        <div className="flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-900 block text-[10px] uppercase tracking-wide">
                              Keterangan Tunggakan Lalu:
                            </span>
                            <span className="font-semibold text-slate-800 whitespace-normal break-words">
                              {sbDuesNote}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* KARTU REKENING BENDAHARA RESMI */}
                <div className="relative rounded-2xl p-4 sm:p-5 text-white shadow-lg overflow-hidden border border-blue-400/40 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        <span>Rekening Resmi Bendahara Gang</span>
                      </span>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-sky-300">Bank Transfer:</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono font-black text-xs">
                          {TREASURER_BANK.bankName}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyText(TREASURER_BANK.accountNumber, setCopiedBankNumber)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md ${
                        copiedBankNumber
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white hover:bg-sky-50 text-slate-900'
                      }`}
                      title="Salin Nomor Rekening Bendahara"
                    >
                      {copiedBankNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-700" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Nomor Rekening Monospace Besar */}
                  <div className="mt-3 py-2 px-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-sky-200 uppercase tracking-widest block font-medium">
                        Nomor Rekening
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-amber-300 select-all">
                        {TREASURER_BANK.accountNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-sky-200 uppercase tracking-widest block font-medium">
                        Atas Nama
                      </span>
                      <span className="font-bold text-sm text-white">
                        {TREASURER_BANK.accountName}
                      </span>
                    </div>
                  </div>

                  {/* Catatan Berita Transfer & Konfirmasi WA */}
                  <div className="mt-3 pt-2.5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-sky-100">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>
                        Berita: <strong className="text-white">Kas Gang - Blok {singleBillingHouse.house.blockNumber}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Konfirmasi WA: <strong className="text-white">{TREASURER_BANK.phone}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview Format Pesan WA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span>Preview Pesan Tagihan WhatsApp:</span>
                      <button
                        type="button"
                        onClick={() => setIsWaTemplateModalOpen(true)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        title="Ubah template format pesan ini"
                      >
                        <Edit2 className="w-3 h-3 text-emerald-600" />
                        <span>(Edit Template Pesan)</span>
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg, setCopiedSingleMsg)}
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      {copiedSingleMsg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSingleMsg ? 'Pesan Tersalin!' : 'Salin Pesan'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                    {msg}
                  </div>
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="p-4 bg-slate-100/90 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyText(TREASURER_BANK.accountNumber, setCopiedBankNumber)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedBankNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedBankNumber ? 'No. Rek Tersalin!' : 'Salin No. Rek Bendahara'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSingleBillingHouse(null)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-200 cursor-pointer font-semibold"
                  >
                    Tutup
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      openWhatsAppShare(msg, singleBillingHouse.house.phone);
                      setSentHouseIds((old) => ({ ...old, [singleBillingHouse.house.id]: true }));
                      setSingleBillingHouse(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Buka & Kirim ke WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL EDIT KETERANGAN & SALDO TUNGGAKAN LALU (TERHUBUNG KE TABEL REKAP PEMBAYARAN IURAN PER KK) */}
      {editingArrearsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-amber-200" />
                  <span>Edit Keterangan Tunggakan Lalu</span>
                </h4>
                <p className="text-[11px] text-amber-100">
                  Blok {editingArrearsItem.house.blockNumber} — {editingArrearsItem.house.duesHeadNameOverride || editingArrearsItem.house.headName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingArrearsItem(null)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditArrears} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saldo Tunggakan Bulan/Tahun Lalu (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={editPrevArrearsAmount}
                  onChange={(e) => setEditPrevArrearsAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Tunggakan Lalu
                </label>
                <textarea
                  rows={3}
                  value={editPrevArrearsNote}
                  onChange={(e) => setEditPrevArrearsNote(e.target.value)}
                  placeholder="Contoh: Tunggakan Agustus 2026, Sisa iuran bulan lalu, dsb."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs resize-none"
                />
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Isian ini tersimpan pada profil rumah dan bersumber langsung dari serta tersinkronisasi ke <strong>Tabel Rekap Pembayaran Iuran Per KK</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingArrearsItem(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Simpan Keterangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TEMPLATE PESAN WHATSAPP PENAGIHAN */}
      {isWaTemplateModalOpen && (
        <EditWaTemplateModal
          isOpen={isWaTemplateModalOpen}
          onClose={() => setIsWaTemplateModalOpen(false)}
          config={config}
          onSave={(newCfg) => {
            if (onUpdateSiteConfig) {
              onUpdateSiteConfig(newCfg);
            }
          }}
          sampleHouse={singleBillingHouse?.house || housesWithArrears[0]?.house || null}
        />
      )}
    </div>
  );
};
