-- ============================================================
-- DATABASE WARGA & KAS GANG MANDOR BLOK K2/25 - K3/24
-- Terakhir Disinkronkan: 2026-11-17T01:00:34.021Z
-- Revisi: #3700
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE IF NOT EXISTS `warga` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `block_number` VARCHAR(32) NOT NULL,
  `head_name` VARCHAR(128) NOT NULL,
  `phone` VARCHAR(32) DEFAULT NULL,
  `ownership` VARCHAR(32) DEFAULT NULL,
  `occupancy` VARCHAR(32) DEFAULT NULL,
  `rukem` VARCHAR(32) DEFAULT NULL,
  `wifi_status` VARCHAR(32) DEFAULT NULL,
  `wifi_provider` VARCHAR(64) DEFAULT NULL,
  `dues_status` VARCHAR(32) DEFAULT NULL,
  `custom_dues_amount` INT DEFAULT NULL,
  `dues_paid_amount` INT DEFAULT NULL,
  `dues_paid_months` INT DEFAULT NULL,
  `dues_prepaid_balance` INT DEFAULT NULL,
  `dues_paid_date` VARCHAR(32) DEFAULT NULL,
  `dues_month_note` VARCHAR(128) DEFAULT NULL,
  `previous_arrears` INT DEFAULT 0,
  `previous_arrears_note` TEXT DEFAULT NULL,
  `previous_baksos_arrears` INT DEFAULT 0,
  `previous_baksos_arrears_note` TEXT DEFAULT NULL,
  `custom_baksos_fine_amount` INT DEFAULT NULL,
  `updated_at` VARCHAR(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `anggota_keluarga` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `resident_house_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(128) NOT NULL,
  `relation` VARCHAR(64) DEFAULT NULL,
  `birth_place` VARCHAR(64) DEFAULT NULL,
  `birth_date` VARCHAR(32) DEFAULT NULL,
  `gender` VARCHAR(32) DEFAULT NULL,
  `religion` VARCHAR(32) DEFAULT NULL,
  `occupation` VARCHAR(64) DEFAULT NULL,
  KEY `idx_resident_house_id` (`resident_house_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `transaksi_kas` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `date` VARCHAR(32) NOT NULL,
  `type` VARCHAR(16) NOT NULL,
  `pool` VARCHAR(32) NOT NULL,
  `category` VARCHAR(64) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `amount` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agenda_baksos` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(128) NOT NULL,
  `date` VARCHAR(32) NOT NULL,
  `location` VARCHAR(128) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `fine_amount` INT DEFAULT 10000
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pengurus` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `role` VARCHAR(64) NOT NULL,
  `phone` VARCHAR(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pengumuman` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(128) NOT NULL,
  `date` VARCHAR(32) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `priority` VARCHAR(16) DEFAULT "normal"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Warga
REPLACE INTO `warga` VALUES ('warga-1793296822969', 'K2/25', 'Budi Santoso', '085353728193', 'Milik Orang Lain', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Belum Bayar', 0, 0, 0, 0, '', '', 0, '', 0, NULL, 0, '2026-11-14T14:27:45.984Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-1793296793457', 'warga-1793296822969', 'Budi Santoso', 'Kepala Keluarga', 'Jakarta', '1976-11-04', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-1794104333081n0p', 'warga-1793296822969', 'Ririn Rosmanah', 'Istri', 'Brebes', '1984-05-18', 'Perempuan', 'Islam', NULL);
REPLACE INTO `anggota_keluarga` VALUES ('m-1794104534274tih', 'warga-1793296822969', 'Nurluthfiyah Salma Ramadhaani', 'Anak', 'Jakarta', '2004-11-11', 'Perempuan', 'Islam', NULL);
REPLACE INTO `anggota_keluarga` VALUES ('m-17941046422577w2', 'warga-1793296822969', 'Muhammad Daffa Arsyad', 'Anak', 'Jakarta', '2010-08-07', 'Laki-laki', 'Islam', NULL);
REPLACE INTO `anggota_keluarga` VALUES ('m-1794104737332q6n', 'warga-1793296822969', 'Sarah Aulia Oktaviani', 'Anak', 'Jakarta', '2012-10-14', 'Perempuan', 'Islam', NULL);
REPLACE INTO `warga` VALUES ('warga-k2-26', 'K2/26', 'Ibnu Fauzi', '082123305445', 'Milik Sendiri', 'Belum Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 15000, 15000, 0, 0, '', 'Juli 2026, Agustus 2026, September 2026, Oktober 2026, November 2026, Desember 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:42.622Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/26-1-1792646454399', 'warga-k2-26', 'Ibnu Fauzi', 'Kepala Keluarga', 'Depok', '1998-04-21', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-27', 'K2/27', 'Adi Dwi Juniardi', '085640056052', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-13', 'November 2026', 0, '', 0, NULL, 0, '2026-11-14T14:28:55.132Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/27-1-1792646454400', 'warga-k2-27', 'Adi Dwi Juniardi', 'Kepala Keluarga', 'Semarang', '1989-06-10', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/27-2-1792646454400', 'warga-k2-27', 'Nurhasana', 'Istri', 'Palembang', '1988-01-30', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/27-3-1792646454400', 'warga-k2-27', 'Muhammad Rafa Adiputra', 'Anak', 'Bekasi', '2017-07-03', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/27-4-1792646454400', 'warga-k2-27', 'Rifqi Naufal Rafif', 'Anak', 'Bekasi', '2019-02-27', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/27-5-1792646454400', 'warga-k2-27', 'Hartati', 'Anak', 'Palembang', '1965-09-30', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-28', 'K2/28', 'Andri Setiawan', '0895412295712', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T12:49:34.715Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/28-1-1792646454400', 'warga-k2-28', 'Andri Setiawan', 'Kepala Keluarga', 'Pemalang', '1995-02-07', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/28-2-1792646454400', 'warga-k2-28', 'Lusi Luviana', 'Istri', 'Brebes', '1996-03-27', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/28-3-1792646454400', 'warga-k2-28', 'Lean Davin Alkahfi', 'Anak', 'Bekasi', '2021-02-22', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/28-4-1792646454400', 'warga-k2-28', 'Sean Izhaar Abqory', 'Anak', 'Bekasi', '2025-09-30', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-29', 'K2/29', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/29-1-1792646454401', 'warga-k2-29', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-30', 'K2/30', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/30-1-1792646454401', 'warga-k2-30', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-31', 'K2/31', 'Ipin Tasripin', '089678229009', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-16', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:44:15.755Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/31-1-1792646454401', 'warga-k2-31', 'Ipin Tasripin', 'Kepala Keluarga', 'Kuningan', '1990-09-07', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/31-2-1792646454401', 'warga-k2-31', 'Murnianingsih', 'Istri', 'Kuningan', '1992-02-07', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/31-3-1792646454401', 'warga-k2-31', 'Kenzie Syauqi Frdaus', 'Anak', 'Kuningan', '2017-09-28', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/31-4-1792646454401', 'warga-k2-31', 'Syamil Shaka Sulaiman', 'Anak', 'Kuningan', '2019-04-29', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/31-5-1792646454401', 'warga-k2-31', 'Rayyina Hannindhiya s', 'Anak', 'Bekasi', '2023-05-23', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-32', 'K2/32', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/32-1-1792646454401', 'warga-k2-32', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-33', 'K2/33', 'Rahmat Danu W', '081293778229', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', '', 0, '', 0, NULL, 0, '2026-11-16T13:45:43.590Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/33-1-1792646454401', 'warga-k2-33', 'Rahmat Danu W', 'Kepala Keluarga', 'Semarang', '1992-12-18', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/33-2-1792646454401', 'warga-k2-33', 'Arum Dwi Yuliana', 'Istri', 'Pati', '1994-07-31', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/33-3-1792646454401', 'warga-k2-33', 'Mysha shaqeena', 'Anak', 'Pati', '2019-12-18', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/33-4-1792646454401', 'warga-k2-33', 'Yasmin Rahma Azzahra', 'Anak', 'Bekasi', '2026-03-09', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-34', 'K2/34', 'Rahmad Sanusi', '085889343792', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-16', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:47:05.672Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/34-1-1792646454401', 'warga-k2-34', 'Rahmad Sanusi', 'Kepala Keluarga', 'Klaten', '1996-10-24', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/34-2-1792646454401', 'warga-k2-34', 'Agil Tri Sumarni', 'Istri', 'Klaten', '1998-08-08', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/34-3-1792646454401', 'warga-k2-34', 'Keenan Hafidz Rivanda', 'Anak', 'Klaten', '2022-02-11', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-35', 'K2/35', 'Wike F Leatemia', '082258412494', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-05', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:48:04.497Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/35-1-1792646454402', 'warga-k2-35', 'Wike F Leatemia', 'Kepala Keluarga', 'Ihamahu Maluku', '1990-03-30', 'Laki-laki', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/35-2-1792646454402', 'warga-k2-35', 'Ramona A Wattimena', 'Istri', 'Seri Maluku', '1990-04-06', 'Perempuan', 'Kristen', '');
REPLACE INTO `warga` VALUES ('warga-k2-36', 'K2/36', 'Bagus Adi P', '085710986469', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-03', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:40:47.616Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/36-1-1792646454402', 'warga-k2-36', 'Bagus Adi P', 'Kepala Keluarga', 'Jakarta', '1972-04-08', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/36-2-1792646454402', 'warga-k2-36', 'Dika Wahyuni', 'Istri', 'Bogor', '1981-11-24', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/36-3-1792646454402', 'warga-k2-36', 'Devina Setyaningrum', 'Anak', 'Bekasi', '2014-03-27', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-37', 'K2/37', 'Rudin Yulianto', '081513696641', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/37-1-1792646454402', 'warga-k2-37', 'Rudin Yulianto', 'Kepala Keluarga', 'Banyumas', '1986-07-27', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/37-2-1792646454402', 'warga-k2-37', 'Ropiqoh', 'Istri', 'Bogor', '1990-03-12', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/37-3-1792646454402', 'warga-k2-37', 'Faqih Fazar Amirza', 'Anak', 'Bogor', '2013-10-02', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/37-4-1792646454402', 'warga-k2-37', 'Fika Rania Sholeha', 'Anak', 'Bekasi', '2019-08-31', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/37-5-1792646454402', 'warga-k2-37', 'Fiko Atharizz Khalif', 'Anak', 'Bekasi', '2023-04-26', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-38', 'K2/38', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/38-1-1792646454402', 'warga-k2-38', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-39', 'K2/39', 'Suparman', '085770901240', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Belum Bayar', 15000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T12:42:20.433Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/39-1-1792646454402', 'warga-k2-39', 'Suparman', 'Kepala Keluarga', 'Jakarta', '1975-02-14', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/39-2-1792646454402', 'warga-k2-39', 'Nurhasanah', 'Istri', 'Jakarta', '1980-09-06', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/39-3-1792646454402', 'warga-k2-39', 'Fitrah Amara Surya', 'Anak', 'Bekasi', '2002-12-15', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/39-4-1792646454402', 'warga-k2-39', 'Reynaldi Fatahillah Surya', 'Anak', 'Bekasi', '2004-08-28', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/39-5-1792646454402', 'warga-k2-39', 'Zaky Fadillah Surya', 'Anak', 'Bekasi', '2008-12-31', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-1794104987203', 'K2/39.1', 'Ari Anggara', '+6288991569497', 'Kontrak', 'Ditempati', 'Tidak Ikut', 'Tidak Pasang', '-', 'Belum Bayar', 30000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T12:59:34.835Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-1794104828923', 'warga-1794104987203', 'Ari Anggara', 'Kepala Keluarga', 'Jakarta', '2000-07-20', 'Laki-laki', 'Islam', NULL);
REPLACE INTO `warga` VALUES ('warga-k2-40', 'K2/40', 'Affriajan Sitohang', '081263218337', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Infotama', 'Belum Bayar', 40000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/40-1-1792646454402', 'warga-k2-40', 'Affrijan Sitohang', 'Kepala Keluarga', 'Baringin Tapanuli Utara', '1988-11-05', 'Laki-laki', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/40-2-1792646454402', 'warga-k2-40', 'Juwita Medina', 'Istri', 'Kedataran', '1994-10-25', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/40-3-1792646454402', 'warga-k2-40', 'Gwen Sari Sitohang', 'Anak', 'Bekasi', '2023-08-15', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/40-4-1792646454402', 'warga-k2-40', 'Queen Carlina Sitohang', 'Anak', 'Bekasi', '2026-01-20', 'Perempuan', 'Kristen', '');
REPLACE INTO `warga` VALUES ('warga-k2-41', 'K2/41', 'Acim Wiratma', '0882001365556', 'Kontrak', 'Ditempati', 'Tidak Ikut', 'Tidak Pasang', '-', 'Lunas', 30000, 0, 1, 0, '2026-11-15', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:47:56.330Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/41-1-1792646454402', 'warga-k2-41', 'Acim Wiratma', 'Kepala Keluarga', 'Indramayu', '1989-01-08', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/41-2-1792646454402', 'warga-k2-41', 'Siti Maryamah', 'Istri', 'Jakarta', '1996-03-05', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/41-3-1792646454402', 'warga-k2-41', 'Ananda Reva Wiratama Putri', 'Anak', 'Jakarta', '2016-03-04', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-42', 'K2/42', 'Egi Tata Pradita', '+6289531242048', 'Kontrak', 'Ditempati', 'Tidak Ikut', 'Tidak Pasang', '-', 'Belum Bayar', 40000, 0, 0, 0, '', '', 0, '', 0, NULL, 0, '2026-11-16T13:50:15.433Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/42-1-1792646454402', 'warga-k2-42', 'Egi Tata Pradita', 'Kepala Keluarga', 'Bekasi', '2005-04-24', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/42-2-1792646454402', 'warga-k2-42', 'Dede Meidisyafitri', 'Istri', 'Bekasi', '2007-04-21', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/42-3-1792646454402', 'warga-k2-42', 'Khaira Kinan Zhafira', 'Anak', 'Cikarang', '2025-03-20', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-43', 'K2/43', 'Aditya Maulana', '082125255358', 'Milik Sendiri', 'Belum Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 15000, 0, 0, 0, '', 'November 2026', 0, '', 0, '', 0, '2026-11-05T00:44:39.770Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/43-1-1792646454402', 'warga-k2-43', 'Aditya Mulana', 'Kepala Keluarga', 'Jakarta', '1989-06-17', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/43-2-1792646454402', 'warga-k2-43', 'Femi Hidayati Wulan', 'Istri', 'Jakarta', '1989-08-01', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/43-3-1792646454402', 'warga-k2-43', 'Aina Talita Zahran', 'Anak', 'Jakarta', '2014-09-24', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/43-4-1792646454402', 'warga-k2-43', 'Farel Atharizz Maulana', 'Anak', 'Tangerang', '2015-11-30', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/43-5-1792646454402', 'warga-k2-43', 'Aina Zayda Kamila', 'Anak', 'Tangerang', '2020-10-04', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-44', 'K2/44', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/44-1-1792646454402', 'warga-k2-44', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-45', 'K2/45', 'Rian Wijaya', '082299220282', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 25000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:41:05.231Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/45-1-1792646454402', 'warga-k2-45', 'Rian Wijaya', 'Kepala Keluarga', 'Karawang', '1986-08-28', 'Laki-laki', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/45-2-1792646454402', 'warga-k2-45', 'Cindy Anastasia Utari', 'Istri', 'Karawang', '1990-09-26', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/45-3-1792646454402', 'warga-k2-45', 'Ivy Jocelyn Wijaya', 'Anak', 'Karawang', '2012-03-29', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/45-4-1792646454402', 'warga-k2-45', 'Viona Christa Wijaya', 'Anak', 'Karawang', '2015-11-23', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/45-5-1792646454402', 'warga-k2-45', 'Claudya Villia Natasha Wijaya', 'Anak', 'Bekasi', '2023-12-18', 'Perempuan', 'Kristen', '');
REPLACE INTO `warga` VALUES ('warga-k2-46', 'K2/46', 'Rumah Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/46-1-1792646454403', 'warga-k2-46', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-47', 'K2/47', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/47-1-1792646454403', 'warga-k2-47', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k2-48', 'K2/48', 'Mangaman Rajagukguk', '089509264006', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 40000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:42:57.107Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/48-1-1792646454403', 'warga-k2-48', 'Mangaman Rajagukguk', 'Kepala Keluarga', 'Banjar Toba', '1961-09-08', 'Laki-laki', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/48-2-1792646454403', 'warga-k2-48', 'Rauli Manurung', 'Istri', 'Porsea Toba', '1956-02-23', 'Perempuan', 'Kristen', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K2/48-3-1792646454403', 'warga-k2-48', 'Novarina Rajagukguk', 'Anak', 'Jakarta', '1991-11-20', 'Perempuan', 'Kristen', '');
REPLACE INTO `warga` VALUES ('warga-k3-01', 'K3/01', 'Adithya MS Dessiri', '081210827016', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', 'Agustus 2026', 0, '', 0, '', 0, '2026-11-17T00:29:58.655Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/01-1-1792646454403', 'warga-k3-01', 'Adithya MS Dessiri', 'Kepala Keluarga', 'Jakarta', '1990-12-05', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/01-2-1792646454403', 'warga-k3-01', 'Dinda Paquita Widya Putri', 'Istri', 'Jakarta', '1999-10-23', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/01-3-1792646454411', 'warga-k3-01', 'Barsena Pradithya Demari', 'Anak', 'Jakarta', '2022-12-23', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/01-4-1792646454411', 'warga-k3-01', 'Barceline Lavanya Annasera', 'Anak', 'Jakarta', '2024-04-28', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/01-5-1792646454411', 'warga-k3-01', 'Barcello Mahavir Danendra', 'Anak', 'Bekasi', '2026-08-28', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-02', 'K3/02', 'Uri Sahuri', '081290200146', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 40000, 0, 1, 0, '2026-11-09', 'November 2026', 0, '', 0, NULL, 0, '2026-11-14T14:30:44.906Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/02-1-1792646454411', 'warga-k3-02', 'Uri Sahuri', 'Kepala Keluarga', 'Kuningan', '1995-10-24', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-03', 'K3/03', 'Iwan Kurniawan', '081315556314', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-08-01', 'Juni 2026', 0, '', 0, NULL, 10000, '2026-11-16T14:13:45.318Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/03-1-1792646454411', 'warga-k3-03', 'Iwan Kurniawan', 'Anak', 'Ciamis', '1992-07-23', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/03-2-1792646454411', 'warga-k3-03', 'Nendah Latofah', 'Istri', 'Ciamis', '1994-01-17', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/03-3-1792646454411', 'warga-k3-03', 'Athaiazka shaquile Alkhalfi Kurniawan', 'Anak', 'Ciamis', '2022-01-30', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-04', 'K3/04', 'Muhidin', '087887332749', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Suryanet', 'Lunas', 25000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:48:32.825Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/04-1-1792646454411', 'warga-k3-04', 'Muhidin', 'Kepala Keluarga', 'Tangerang', '1992-09-09', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/04-2-1792646454411', 'warga-k3-04', 'Wiwi Winarsih', 'Istri', 'Lebak Banten', '1998-07-06', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/04-3-1792646454411', 'warga-k3-04', 'Muhammad Rafka Izatu', 'Anak', 'Tangerang', '2022-08-31', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-05', 'K3/05', 'Sandita', '087887332749', 'Kontrak', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 30000, 0, 1, 0, '2026-11-05', 'November 2026', 0, '', 0, NULL, 0, '2026-11-14T14:32:59.794Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/05-1-1792646454411', 'warga-k3-05', 'Sandita', 'Kepala Keluarga', 'Lebak Banten', '2002-08-20', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-06', 'K3/06', 'Yudi Sakuri', '081285781387', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', 'Juni 2026', 495000, 'Iuran 2025 : Rp. 335.000 | Iuran Januari, Februari, Maret, Mei 2026 : Rp. 160.000     
Baksos 2025 : Rp. 40.000 | Baksos Januari, Februari, Juni 2026 : Rp. 30.000', 0, '', 0, '2026-11-16T13:38:05.067Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/06-1-1792646454411', 'warga-k3-06', 'Yudi Sakuri', 'Kepala Keluarga', 'Yogyakarta', '1967-03-09', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/06-2-1792646454411', 'warga-k3-06', 'Erni Rahayu', 'Istri', 'Cilacap', '1969-01-24', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/06-3-1792646454411', 'warga-k3-06', 'Aquera Ryana', 'Anak', 'Jakarta', '2012-12-16', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-07', 'K3/07', 'Ifan Setiawan', '089634717909', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 25000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:43:36.107Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/07-1-1792646454411', 'warga-k3-07', 'Ifan Setiawan', 'Kepala Keluarga', 'Pemalang', '1995-11-05', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/07-2-1792646454411', 'warga-k3-07', 'Anidia Puspa Pratiwi', 'Istri', 'Bogor', '1997-10-07', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/07-3-1792646454411', 'warga-k3-07', 'Hafiz Ghazy Muammar', 'Anak', 'Bogor', '2022-07-14', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-08', 'K3/08', 'Saefulloh', '081381702126', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-1-1792646454411', 'warga-k3-08', 'Saefulloh', 'Kepala Keluarga', 'Tegal', '1975-01-21', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-2-1792646454411', 'warga-k3-08', 'Pitri', 'Istri', 'Sukabumi', '1988-09-09', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-3-1792646454411', 'warga-k3-08', 'Silpia', 'Anak', 'Sukabumi', '2007-03-12', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-4-1792646454411', 'warga-k3-08', 'Siti Nadia', 'Anak', 'Sukabumi', '2011-05-05', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-5-1792646454411', 'warga-k3-08', 'Pebi Ayu Wandira', 'Anak', 'Sukabumi', '2016-10-29', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/08-6-1792646454411', 'warga-k3-08', 'Daffa Zaeyan', 'Anak', 'Depok', '2024-07-29', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-09', 'K3/09', 'Geget Yotama', '085219845710', 'Kontrak', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 40000, 0, 1, 0, '2026-11-04', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:43:54.459Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/09-1-1792646454411', 'warga-k3-09', 'Geget Yotama', 'Kepala Keluarga', 'Laay Lampung', '1989-09-13', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/09-2-1792646454411', 'warga-k3-09', 'Dini Andini', 'Istri', 'Bogor', '1995-06-15', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/09-3-1792646454412', 'warga-k3-09', 'Gadis Wulandari', 'Anak', 'Bogor', '2018-02-26', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/09-4-1792646454412', 'warga-k3-09', 'Angga Putra Yotama', 'Anak', 'Bogor', '2021-09-05', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-10', 'K3/10', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/10-1-1792646454412', 'warga-k3-10', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-11', 'K3/11', 'Asep Deni Susanto', '082213844447', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 40000, 0, 0, '', 'Juli 2026, Agustus 2026, September 2026, Oktober 2026, November 2026, Desember 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:53.460Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/11-1-1792646454412', 'warga-k3-11', 'Asep Deni Susanto', 'Kepala Keluarga', 'Majalengka', '1990-09-27', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/11-2-1792646454412', 'warga-k3-11', 'Surnawati', 'Istri', 'T Betung Lampung', '1987-02-01', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/11-3-1792646454412', 'warga-k3-11', 'Elvina Launa Susanto', 'Anak', 'Majalengka', '2021-09-04', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-12', 'K3/12', 'Sunardi', '081289284617', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Lunas', 40000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:44:13.388Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/12-1-1792646454412', 'warga-k3-12', 'Sunardi', 'Kepala Keluarga', 'Kebumen', '1974-07-16', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/12-2-1792646454412', 'warga-k3-12', 'Irmayani', 'Istri', 'Sukabumi', '1978-03-10', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-13', 'K3/13', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/13-1-1792646454412', 'warga-k3-13', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-14', 'K3/14', 'Septiyan Dwi Wibowo', '085211863314', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-16', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:49:14.816Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/14-1-1792646454412', 'warga-k3-14', 'Septiyan Dwi Wibowo', 'Kepala Keluarga', 'Purworejo', '1992-09-15', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/14-2-1792646454412', 'warga-k3-14', 'Nur Fitriyani', 'Istri', 'Tegal', '1993-03-27', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/14-3-1792646454412', 'warga-k3-14', 'Muhammad Devandrang', 'Anak', 'Tegal', '2019-03-17', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/14-4-1792646454412', 'warga-k3-14', 'Qinara Almara Saidah', 'Anak', 'Tegal', '2021-09-11', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-15', 'K3/15', 'Hendra Dwi Nuryanto', '081289284617', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Lunas', 40000, 0, 1, 0, '2026-11-16', 'November 2026', 0, '', 0, NULL, 0, '2026-11-16T13:49:30.382Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/15-1-1792646454412', 'warga-k3-15', 'Hendra Dwi Nuryanto', 'Kepala Keluarga', 'Brebes', '1997-06-14', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/15-2-1792646454412', 'warga-k3-15', 'Puput Widiasari', 'Istri', 'Tegal', '1999-09-29', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/15-3-1792646454412', 'warga-k3-15', 'Syeina Nayaka Nitisara', 'Anak', 'Tegal', '2022-11-01', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/15-4-1792646454412', 'warga-k3-15', 'Nareya Alsheiraz Mahendra', 'Anak', 'Bekasi', '2024-10-03', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-16', 'K3/16', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/16-1-1792646454412', 'warga-k3-16', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-17', 'K3/17', 'Heri Susanto', '081284649860', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Pasang', 'Blessnet', 'Belum Bayar', 40000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/17-1-1792646454412', 'warga-k3-17', 'Heri Susanto', 'Kepala Keluarga', 'Putra Aji Dua Lampung', '1994-10-21', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-18', 'K3/18', 'Deden Wahyudin', '082297943445', 'Milik Sendiri', 'Belum Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Belum Bayar', 15000, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/18-1-1792646454412', 'warga-k3-18', 'Deden Wahyudin', 'Kepala Keluarga', 'Majalengka', '1993-12-24', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/18-2-1792646454412', 'warga-k3-18', 'Bilqis Salsalbilah Aulia S', 'Istri', 'Gresik', '2001-09-21', 'Perempuan', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/18-3-1792646454412', 'warga-k3-18', 'Myesha Maheefa Aulia W', 'Anak', 'Surabaya', '2022-11-11', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-19', 'K3/19', 'Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/19-1-1792646454412', 'warga-k3-19', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-20', 'K3/20', 'Denny Sanjaya', '087886860466', 'Milik Sendiri', 'Ditempati', 'Ikut Rukem', 'Tidak Pasang', '-', 'Belum Bayar', 40000, 0, 0, 0, '', 'November 2026', 0, 'Iuran Agustus, September, Oktober 2026', 20000, '', 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/20-1-1792646454412', 'warga-k3-20', 'Denny Putu Sanjaya', 'Kepala Keluarga', 'Samarinda', '1983-10-27', 'Laki-laki', 'Islam', '');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/20-2-1792646454412', 'warga-k3-20', 'Nia Kurniati', 'Istri', 'Cianjur', '1983-10-06', 'Perempuan', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-21', 'K3/21', 'Rumah Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/21-1-1792646454412', 'warga-k3-21', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-22', 'K3/22', 'Rita Damanik', '082299220282', 'Kontrak', 'Ditempati', 'Tidak Ikut', 'Tidak Pasang', '-', 'Lunas', 30000, 0, 1, 0, '2026-11-01', 'November 2026', 0, '', 0, NULL, 0, '2026-11-05T00:41:17.744Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/22-1-1792646454412', 'warga-k3-22', 'Rita Damanik', 'Orang Tua', 'Pematangsiantar', '1966-01-17', 'Perempuan', 'Kristen', '');
REPLACE INTO `warga` VALUES ('warga-k3-23', 'K3/23', 'Rumah Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/23-1-1792646454412', 'warga-k3-23', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');
REPLACE INTO `warga` VALUES ('warga-k3-24', 'K3/24', 'Rumah Kosong', 'Kosong', 'Milik Sendiri', 'Kosong', 'Tidak Ikut', 'Tidak Pasang', '-', 'Kosong', 0, 0, 0, 0, '', 'November 2026', 0, '', 0, NULL, 0, '2026-11-04T18:03:08.849Z');
REPLACE INTO `anggota_keluarga` VALUES ('m-K3/24-1-1792646454412', 'warga-k3-24', 'Kosong', 'Anak', 'Kosong', '1990-01-01', 'Laki-laki', 'Islam', '');

-- Data Transaksi Kas
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794875398655-0-dtu7', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/01 (Adithya MS Dessiri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794875398655-1-jfny', '2026-08-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juli, Agustus 2026) - Blok K3/01 (Adithya MS Dessiri)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794875398655-2-9vir', '2026-08-06', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (Juli 2026) Blok K3/01 (Adithya MS Dessiri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794838353345-0-xdwi', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K3/03 (Iwan Kurniawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794837780089-0-186b', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/03 (Iwan Kurniawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794837461949-0-y2tc', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/03 (Iwan Kurniawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836970382-0-44hy', '2026-11-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836970382-1-vr5r', '2026-11-16', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (Oktober 2026) Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836954816-0-dwud', '2026-11-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836912825-0-0e2v', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836912825-1-ajc3', '2026-11-16', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/04 (Muhidin)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836876330-0-4diu', '2026-11-15', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836825672-0-xi0l', '2026-11-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/34 (Rahmad Sanusi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836825672-1-mln3', '2026-11-16', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/34 (Rahmad Sanusi)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836655755-0-hmoy', '2026-11-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794836285068-0-iboy', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K3/06 (Yudi Sakuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794833374715-0-dkt6', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794666779794-0-mz8x', '2026-11-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794666736849-0-ds08', '2026-11-11', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/03 (Iwan Kurniawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794666644906-0-gyix', '2026-11-09', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794666644906-1-zwxz', '2026-11-09', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/02 (Uri Sahuri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1794666535132-0-u2tz', '2026-11-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/27 (Adi Dwi Juniardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839684497-0-sysm', '2026-11-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/35 (Wike F Leatemia)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839684497-1-f2ja', '2026-11-05', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/35 (Wike F Leatemia)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839684497-2-0qqu', '2026-11-05', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (September 2026, Oktober 2026) Blok K2/35 (Wike F Leatemia)', 80000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839453388-0-2rb4', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839434459-0-ndwp', '2026-11-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839416107-0-05af', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/07 (Ifan Setiawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839377107-0-5gwi', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839277744-0-19xb', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K3/22 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839265231-0-v74l', '2026-11-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793839247616-0-ym6i', '2026-11-03', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (November 2026) Warga Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793815433460-0-vkq3', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Kas Warga Bayar Lebih (Juli 2026, Agustus 2026, September 2026, Oktober 2026, November 2026, Desember 2026) Warga Blok K3/11 (Asep Deni Susanto)', 240000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793815422622-0-job2', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Kas Warga Bayar Lebih (Juli 2026, Agustus 2026, September 2026, Oktober 2026, November 2026, Desember 2026) Warga Blok K2/26 (Ibnu Fauzi)', 90000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793815038268-0-ol75', '2026-09-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K2/43 (Aditya Maulana)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793815038268-1-9e08', '2026-09-01', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (Maret 2026, April 2026, Mei 2026, Juni 2026, Juli 2026, Agustus 2026) Blok K2/43 (Aditya Maulana)', 120000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793812068313-0-nbj8', '2026-09-18', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793812068313-1-yt43', '2026-09-18', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811872172-0-bafv', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811872172-1-g9u6', '2026-05-10', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (April 2026) Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811666278-0-jpic', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K2/34 (Rahmad Sanusi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811666278-1-rps5', '2026-08-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos Blok K2/34 (Rahmad Sanusi)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811666278-2-u2ja', '2026-08-01', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K2/34 (Rahmad Sanusi)', 80000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811631470-0-6btk', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juli 2026) Warga Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811631470-1-jenu', '2026-07-13', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811570717-0-ctbw', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811570717-1-88gl', '2026-08-05', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811542826-0-ynau', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811542827-1-06uq', '2026-08-05', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811516965-0-fne9', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811516965-1-1wxh', '2026-08-05', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811457228-0-ksjs', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K2/35 (Wike F Leatemia)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811457228-1-phd9', '2026-08-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Agustus 2026) Blok K2/35 (Wike F Leatemia)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811457228-2-2eht', '2026-08-01', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K2/35 (Wike F Leatemia)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811353814-0-lqyh', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/33 (Rahmat Danu W)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811353814-1-nq1q', '2026-06-07', 'masuk', 'Kas Utama', 'Denda Baksos', 'Denda Baksos Blok K2/33 (Rahmat Danu W)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793811353814-2-171w', '2026-06-07', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pembayaran Tunggakan Blok K2/33 (Rahmat Danu W)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793810990308-0-77jk', '2026-09-14', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (Juni 2026, Juli 2026) Blok K3/20 (Denny Sanjaya)', 80000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793803504588-0-egtc', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/42 (Mustolih Safari)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793794163998-0-fmzn', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/35 (Wike F Leatemia)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793768687671-0-lks4', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793768687672-1-5vvj', '2026-05-10', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan (Maret 2026, April 2026) Blok K2/40 (Affriajan Sitohang)', 80000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793749626060-0-r33x', '2026-07-05', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/20 (Denny Sanjaya)', 120000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793711905404-qye1', '2026-10-25', 'keluar', 'Cashback Sampah', 'Pengeluaran Cashback Sampah', 'Biaya Pembuatan Tempat Penampungan Bank Sampah', 289000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793711843055-pisr', '2026-10-12', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793710262668-gn0h', '2026-10-12', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793710222466-a6n7', '2026-10-11', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Kerja Bakti', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793710179145-59g8', '2026-10-08', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Iuran Rukem Dan Kas RT', 196000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793710115112-lnlk', '2026-08-15', 'masuk', 'Kas Utama', 'Kas Utama', 'Donasi Asep Deni Susanto (K3/11) ', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793710039921-tcty', '2026-10-01', 'masuk', 'Kas Utama', 'Kas Utama', 'Iuran Kas Bulanan (Oktober 2026)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709951480-0-xm6x', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/18 (Deden Wahyudin)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709951480-1-dgfu', '2026-10-01', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/18 (Deden Wahyudin)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709912451-0-26x2', '2026-10-20', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709912451-1-mn4p', '2026-10-20', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/17 (Heri Susanto)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709912451-2-dll8', '2026-10-20', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709848945-0-xkhr', '2026-10-11', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709827062-0-hmbq', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709780795-0-qv36', '2026-10-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709753395-0-7zl8', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709753395-1-9a7r', '2026-10-16', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/08 (Saefulloh)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709753395-2-ql1p', '2026-10-16', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709668345-0-00g1', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709641146-0-2b6q', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709617956-0-xggb', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/03 (Iwan Kurniawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709617956-1-dds4', '2026-10-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/03 (Iwan Kurniawan)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709592821-0-zd4p', '2026-10-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793709592821-1-cotd', '2026-10-07', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/02 (Uri Sahuri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707988314-0-ioil', '2026-10-20', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707955508-0-va5g', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K3/22 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707926993-0-oms7', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707892987-0-umwl', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/43 (Aditya Maulana)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707883162-0-egdw', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/39 (Suparman)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707852014-0-ekxc', '2026-10-18', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707821325-0-mycq', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707821325-1-q5zs', '2026-10-16', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707583376-0-u1d0', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707583376-1-1zjs', '2026-10-16', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/37 (Rudin Yulianto)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707583376-2-2jha', '2026-10-16', 'masuk', 'Kas Utama', 'Pembayaran Tunggakan', 'Pelunasan Tunggakan Lalu Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707529111-0-37zt', '2026-10-03', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707529111-1-31ab', '2026-10-03', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/36 (Bagus Adi P)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707487665-0-32g5', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/34 (Rahmad Sanusi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707487665-1-fzvl', '2026-10-16', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/34 (Rahmad Sanusi)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707453488-0-nn0y', '2026-10-16', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707426427-0-jyg1', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707426427-1-ojo3', '2026-10-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/28 (Andri Setiawan)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793707404087-0-4hje', '2026-10-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Oktober 2026) Warga Blok K2/27 (Adi Dwi Juniardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793706690713-0-yclw', '2026-09-15', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K3/07 (Ifan Setiawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793706600001-0-kic5', '2026-09-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K3/06 (Yudi Sakuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793706600001-1-v3nr', '2026-09-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/06 (Yudi Sakuri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793702633484-0-zmqt', '2026-09-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K2/39 (Suparman)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793702109458-0-n9bo', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K2/39 (Suparman)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793701941394-0-lxia', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/13 (Vicky Firdaus)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793701643735-0-mobs', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juli 2026) Warga Blok K2/39 (Suparman)', 15000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793701384348-0-wenn', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K2/27 (Adi Dwi Juniardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793697720292-0-b9j1', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juli 2026) Warga Blok K2/27 (Adi Dwi Juniardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793694622656-0-dtac', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/39 (Suparman)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793694622657-1-e3fh', '2026-06-10', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/39 (Suparman)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688530879-0-wccz', '2026-06-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/35 (Wike F Leatemia)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688474552-0-15wh', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688456121-0-ivx8', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/27 (Adi Dwi Juniardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688112931-0-stjt', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688054083-0-2lx8', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793688026628-0-j5jd', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793687891152-0-3la3', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793687731735-0-4v8t', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K2/39 (Suparman)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793660676065-0-gqvh', '2026-05-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Kas Warga Bayar Lebih (Mei 2026, Juni 2026) Warga Blok K2/26 (Ibnu Fauzi)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793634929945-0-4wvy', '2026-09-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/35 (Wike F Leatemia)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634805212-5mhy', '2026-09-11', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Rukem Dan Kas RT', 189000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634752934-sqoc', '2026-09-25', 'masuk', 'Cashback WiFi', 'Cashback WiFi', 'Cashback', 380000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634700254-ph1s', '2026-09-11', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634659659-oynv', '2026-09-11', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634626815-zn7t', '2026-09-08', 'keluar', 'Kas Utama', 'Kas Utama', 'Pembelian Kenang-Kenangan Suparman', 120000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634568627-ob9o', '2026-09-06', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Kerja Bakti', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793634534400-0n6c', '2026-09-01', 'keluar', 'Kas Utama', 'Kas Utama', 'Bingkisan Jenguk Mangaman Rajagukguk (K2/48) ', 50000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793630193178-0-ou2z', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/18 (Deden Wahyudin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793624971532-0-yure', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793624955314-0-gp5v', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793619015875-0-36hz', '2026-06-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793618276317-0-tp4j', '2026-05-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793618255956-0-86m7', '2026-05-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793618247157-0-hhm7', '2026-05-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793455913005-0-qgku', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/22 (Saudara Om Wike)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793441269821-0-qtvy', '2026-06-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juni 2026) Warga Blok K3/13 (Vicky Firdaus)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793437303006-0-thv2', '2026-09-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/15 (Hendra Dwi Nuryanto)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793437287958-0-5oa5', '2026-09-18', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/14 (Septiyan Dwi Wibowo)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793432408564-0-867x', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/07 (Ifan Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793430686274-0-5691', '2026-07-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/36 (Bagus Adi P)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793419425647-0-yxqp', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juli 2026) Warga Blok K3/18 (Deden Wahyudi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793413818067-0-tfgy', '2026-05-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Mei 2026) Warga Blok K3/13 (Vicky Firdaus)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793377574868-0-o1d0', '2026-09-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/04 (Muhidin)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793377561447-0-l7ac', '2026-09-09', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/03 (Iwan Kurniawan)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793377546375-0-4icx', '2026-09-11', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/02 (Uri Sahuri)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793377072963-v0op', '2026-09-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793377054407-q18f', '2026-09-18', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793377004876-3hju', '2026-09-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376980893-7khm', '2026-09-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376844336-irse', '2026-09-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376831833-x4am', '2026-09-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376813377-do8b', '2026-09-09', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/03 (Iwan Kurniawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376790266-8299', '2026-09-11', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376560754-2sbj', '2026-09-30', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793376403835-a3ro', '2026-09-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793375251847-0-u20o', '2026-09-04', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/36 (Bagus Adi P)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793372295708-0-20gj', '2026-09-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/34 (Rahmad Sanusi)', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793372285910-0-g6v8', '2026-09-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/33 (Rahmat Danu W)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793372240214-fi8w', '2026-09-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K2/34 (Rahmad Sanusi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793372225976-r4bb', '2026-09-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K2/33 (Rahmat Danu W)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793368504633-0-afmz', '2026-06-03', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/36 (Bagus Adi P)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793365904009-0-bnti', '2026-05-04', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K2/36 (Bagus Adi P)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1793356102300-xu3i', '2026-09-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (September 2026) Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793341185731-0-de5e', '2026-09-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793341151738-0-a2hc', '2026-09-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (September 2026) Warga Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793336944872-0-70o7', '2026-08-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/11 (Asep Deni Susanto)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793335597787-0-9qcd', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Agustus 2026) Warga Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-dues-sync-1793335597787-1-n3is', '2026-08-05', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Rp 10.000) - Blok K3/14 (Septiyan Dwi Wibowo)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-init-mei-kas', '2026-04-30', 'masuk', 'Kas Utama', 'Kas Utama', 'Saldo Awal Inputan Periode Mei 2026', 275000);
REPLACE INTO `transaksi_kas` VALUES ('tx-init-mei-sampah', '2026-04-30', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Saldo Awal Cashback Sampah Bulan Sebelumnya (Periode Mei 2026)', 1265000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947947044-9hu0', '2026-08-07', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947797670-dfaw', '2026-07-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Denda Baksos Blok K2/33 (Rahmat Danu W)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947665689-sn3k', '2026-08-09', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Baksos', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947499367-4llc', '2026-08-07', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Tambahan Hadiah Anak-Anak Agustusan', 350000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947414512-kvsb', '2026-08-07', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947350276-sh8p', '2026-08-05', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Rukem Dan Kas RT', 203000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792947313400-039n', '2026-08-01', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Pembuatan Gapura', 47000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946960387-mj6z', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946935163-5839', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946891256-tb3y', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/06 (Yudi Sakuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946875759-6giv', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946865519-vo20', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946775350-icx9', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946745333-5glw', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946728981-zrxy', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/46 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946721640-lqy0', '2026-08-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946700391-q1ei', '2026-08-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/40 (Affriajan Sitohang)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946670986-uw6k', '2026-08-02', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Agustus 2026) Blok K2/37 (Rudin Yulianto)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946670983-8vxy', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946657639-m358', '2026-08-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946616727-bzhg', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/33 (Rahmat Danu W)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946607413-85rk', '2026-08-02', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Agustus 2026) Blok K2/31 (Ipin Tasripin)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946607410-aosq', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792946590725-ggo5', '2026-08-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Agustus 2026) Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914335528-djm4', '2026-07-15', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914290432-qh56', '2026-07-23', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Kuas Dan Tambang', 59000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914253551-xu7t', '2026-07-16', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Bambu (Untuk Agustusan) ', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914208244-0g71', '2026-07-15', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Cat (Untuk Agustusan) ', 150000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914150023-ccdp', '2026-07-15', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Baksos', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792914096865-k3wn', '2026-07-15', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Rukem Dan Kas RT', 203000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792851167998-l65v', '2026-07-15', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792849069588-ypmi', '2026-07-03', 'masuk', 'Kas Utama', 'Iuran Warga', 'Iuran Bulanan (Juli 2026) Warga Blok K2/28 (Andri Setiawan)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848705596-qtsq', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848679372-b86w', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/13 (Vicky Firdaus)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848664344-ej3s', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848606405-1h4e', '2026-07-03', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848583660-or4k', '2026-07-14', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/07 (Ifan Setiawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848556494-qxjg', '2026-07-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juli 2026) Blok K3/06 (Yudi Sakuri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848556490-f5m0', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/06 (Yudi Sakuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848521850-6rr0', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/05 (Sandita)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848508981-9ahg', '2026-07-01', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juli 2026) Blok K3/04 (Muhidin)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848508978-xdqt', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/04 (Muhidin)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848481874-2w5r', '2026-07-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/03 (Iwan Kurniawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848448337-jdcp', '2026-07-14', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juli 2026) Blok K3/02 (Uri Sahuri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848448333-kqnx', '2026-07-14', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848425062-5rrp', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848396847-r64x', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/46 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848375689-o0tk', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848340002-ryt4', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/41 (Acim Wiratma)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848269858-qt0s', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848228315-1j8k', '2026-07-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848138800-wqad', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/33 (Rahmat Danu W)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848120630-jm9y', '2026-07-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juli 2026) Blok K2/31 (Ipin Tasripin)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792848120627-gfmx', '2026-07-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juli 2026) Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792847539948-hn1a', '2026-06-26', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Rapat Bapak-Bapak', 125000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792847492923-tljr', '2026-06-19', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Rukem Dan Kas RT', 203000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792847450130-0s79', '2026-06-14', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Gelas Plastik (Baksos) ', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792847395043-rpty', '2026-06-14', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Baksos', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792847322496-id2s', '2026-06-13', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Bensin Mesin Potong', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792840898125-6oc2', '2026-06-30', 'keluar', 'Cashback Sampah', 'Pengeluaran Cashback Sampah', 'Pembelian Mesin Potong Rumput Dan Alat Kebersihan Gang', 931000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833782528-ueee', '2026-06-25', 'masuk', 'Cashback WiFi', 'Cashback WiFi', 'Cashback', 280000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833705551-9a1y', '2026-06-11', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833673340-iuhm', '2026-06-11', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833535376-7373', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/17 (Heri Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833517565-aqoj', '2026-06-07', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juni 2026) Blok K3/15 (Hendra Dwi Nuryanto)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833517562-hf2n', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/15 (Hendra Dwi Nuryanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833502682-syd2', '2026-06-09', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833460318-3z2m', '2026-06-04', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juni 2026) Blok K3/12 (Sunardi)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833460315-ii8d', '2026-06-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833435091-m478', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/11 (Asep Deni Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833412545-39uw', '2026-06-05', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/09 (Geget Yotama)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833393206-h1gf', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/08 (Saefulloh)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833370463-4hlw', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/07 (Ifan Setiawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833277723-n3py', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833256016-h9ps', '2026-06-13', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juni 2026) Blok K3/01 (Adithya MS Dessiri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833256013-znlf', '2026-06-13', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K3/01 (Adithya MS Dessiri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833247097-ugzr', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/48 (Mangaman Rajagukguk)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833142481-qjla', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/46 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833131572-nrof', '2026-06-01', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833038059-llz2', '2026-06-09', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Juni 2026) Blok K2/37 (Rudin Yulianto)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833038052-ioye', '2026-06-09', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/37 (Rudin Yulianto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792833020806-4mp9', '2026-06-03', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792832951615-kucp', '2026-06-07', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Juni 2026) Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830786206-if6r', '2026-05-21', 'masuk', 'Cashback Sampah', 'Cashback Sampah', 'Cashback', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830574310-uw6g', '2026-05-28', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Tambahan Acara Bakar-Bakar', 50000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830538807-19i1', '2026-05-25', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Lampu', 50000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830507630-ktss', '2026-05-23', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Rukem Dan Kas RT', 203000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830465180-8vrx', '2026-05-21', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembayaran Iuran Sampah', 700000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830408702-kikz', '2026-05-17', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Beli Gelas Plastik (Baksos) ', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830368688-9wyv', '2026-05-17', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Bambu (Perbaikan Alat Penarikan Got) ', 20000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830291222-f9ah', '2026-05-17', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Konsumsi Kerja Bakti', 100000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792830240490-849m', '2026-05-07', 'keluar', 'Kas Utama', 'Pengeluaran Gang', 'Pembelian Ban Dalam (Perbaikan Alat Penarikan Got) ', 45000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792828171717-3wye', '2026-05-02', 'masuk', 'Kas Utama', 'Kas Utama', 'Donasi (Aditya Ms Dessiri K3/01) ', 200000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812879128-1les', '2026-05-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/12 (Sunardi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812801156-f10x', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/14 (Septiyan Dwi Wibowo)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812759991-naaw', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/11 (Asep Deni Susanto)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812646525-x9c4', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/07 (Ifan Setiawan)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812520556-wk04', '2026-05-08', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/02 (Uri Sahuri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812495128-heq7', '2026-05-17', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Mei 2026) Blok K3/01 (Adithya MS Dessiri)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792812495121-740q', '2026-05-17', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K3/01 (Adithya MS Dessiri)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792803760588-5pq1', '2026-05-28', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/46 (Rita Damanik)', 30000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792803747368-oprd', '2026-05-28', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/45 (Rian Wijaya)', 25000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792802811691-mobd', '2026-05-04', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/36 (Bagus Adi P)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792802728770-4d05', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/34 (Rahmad Sanusi)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792802690560-hi6a', '2026-05-10', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/31 (Ipin Tasripin)', 40000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792802598840-4de8', '2026-05-02', 'masuk', 'Kas Utama', 'Denda Baksos', 'Pelunasan Denda Baksos (Mei 2026) Blok K2/28 (Andri Setiawan)', 10000);
REPLACE INTO `transaksi_kas` VALUES ('tx-1792802598837-0i5p', '2026-05-02', 'masuk', 'Kas Utama', 'Iuran Warga', 'Penarikan Iuran Bulanan (Mei 2026) Blok K2/28 (Andri Setiawan)', 40000);

-- Data Agenda Bakti Sosial
REPLACE INTO `agenda_baksos` VALUES ('baksos-1793945806809', 'BAKSOS NOVEMBER', '2026-11-08', 'Sepanjang Gang Mandor', 'BAKSOS NOVEMBER', 10000);

-- Data Pengurus & Kontak Layanan
REPLACE INTO `pengurus` VALUES ('kom-1', 'Bpk. Amin Mustakim', 'Ketua RW 018', '+6281808288964');
REPLACE INTO `pengurus` VALUES ('kom-2', 'Bpk. Giarno', 'Ketua RT', '+6285890797670');
REPLACE INTO `pengurus` VALUES ('kom-4', 'Bpk. Ifan Setiawan', 'Ketua Gang', '+6289634717909');
REPLACE INTO `pengurus` VALUES ('kom-5', 'Bpk. Rian Wijaya', 'Wakil / Sekertaris Gang', '+6282299220282');
REPLACE INTO `pengurus` VALUES ('kom-1792780358822', 'Bpk. Muhidin Akbar', 'Bendahara Gang', '+6287887332749');
REPLACE INTO `pengurus` VALUES ('kom-1792780836986', 'Admin Blesnett', 'Koordinator Keluhan Wifi', '+6281953698389');

-- Data Papan Pengumuman
REPLACE INTO `pengumuman` VALUES ('ann-1792781335774', 'PENARIKAN KAS GANG', '2026-11-03', '📢 PENGUMUMAN PENARIKAN KAS GANG 

Assalamu’alaikum warahmatullahi wabarakatuh.

Yth. Bapak/Ibu Warga Gang Mandor, 

Izin mengingatkan dalam rangka memenuhi kebutuhan bersama dan mendukung kegiatan gang, kami informasikan bahwa penarikan iuran kas gang akan dilaksanakan dengan ketentuan sebagai berikut:
1. Pengurus akan melakukan penarikan door to door sebelum tanggal 15 di setiap bulannya. 
2. Pembayaran paling lambat tgl 15 setiap bulannya. Jika sudah lewat tanggal 15, maka warga bisa langsung antarkan ke rumah bendahara atau bisa via transfer. 
3.Jika sudah melewati tanggal 15 data yang belum membayar akan masuk kedalam data tunggakan. 

💳 Pembayaran: Transfer rekening atau tunai kepada bendahara gang.
🏦 REKENING TUJUAN
- Bank: BCA
- Nomor Rekening: 7130889411
- Atas Nama: Muhidin Akbar
- Berita Transfer: Kas Gang – Nama Blok/Nomor Rumah

Mohon Bapak/Ibu dapat melakukan pembayaran sebelum batas waktu yang telah ditentukan. Bagi warga yang sudah membayar, kami ucapkan terima kasih atas partisipasinya.

Mari kita tingkatkan kepedulian dan kebersamaan demi gang yang bersih, aman, nyaman, dan harmonis.

Terima kasih atas perhatian dan kerja sama seluruh warga. 🙏

Hormat kami,
Pengurus Gang Mandor', 'penting');

SET FOREIGN_KEY_CHECKS = 1;
-- Selesai Ekspor SQL
