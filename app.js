import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.mjs';

const db = new Dexie('UMKMDatabase');
db.version(1).stores({
  stok: '++id, nama, kategori, jumlah',
  transaksi: '++id, tipe, nominal, keterangan'
});

// Contoh fungsi tambah barang
async function tambahBarang(nama, kategori, jumlah) {
  await db.stok.add({ nama, kategori, jumlah });
  alert("Data Tersimpan Lokal!");
}

// Event Listener
document.getElementById('addBtn').addEventListener('click', () => {
  tambahBarang('Produk Contoh', 'Makanan', 10);
});
