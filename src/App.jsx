import React, { useState, useEffect } from 'react';
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Package, ArrowUpCircle, ArrowDownCircle, Plus, Trash2, CheckCircle } from 'lucide-react';

export default function App() {
  // Ambil data langsung dari IndexedDB
  const categories = useLiveQuery(() => db.categories.toArray());
  const transactions = useLiveQuery(() => db.transactions.toArray());

  // State untuk Dashboard
  const [stats, setStats] = useState({ masuk: 0, keluar: 0, stokKategori: 0 });
  const [formTx, setFormTx] = useState({ type: 'cash_in', amount: '', desc: '' });

  // Update Dashboard Otomatis
  useEffect(() => {
    if (transactions && categories) {
      const masuk = transactions.filter(t => t.type === 'cash_in').reduce((a, b) => a + b.amount, 0);
      const keluar = transactions.filter(t => t.type === 'cash_out').reduce((a, b) => a + b.amount, 0);
      setStats({ masuk, keluar, stokKategori: categories.length });
    }
  }, [transactions, categories]);

  // Fungsi Tambah Data
  const addCategory = async () => {
    const name = prompt("Masukkan Nama Kategori (Cth: Elektronik):");
    const icon = prompt("Masukkan Emoji Icon (Cth: ??):");
    if (name && icon) await db.categories.add({ name, icon });
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!formTx.amount || !formTx.desc) return alert('Isi jumlah dan keterangan!');
    
    await db.transactions.add({
      type: formTx.type,
      amount: parseInt(formTx.amount),
      description: formTx.desc,
      date: new Date().toISOString()
    });
    
    setFormTx({ type: 'cash_in', amount: '', desc: '' }); // Reset form
    alert('Transaksi berhasil dicatat!');
  };

  const deleteCategory = async (id) => {
    if (confirm("Yakin hapus kategori ini?")) await db.categories.delete(id);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 p-6 glass-card border-b-4 border-b-cyan-500">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
          CASHFLOW PRO
        </h1>
      </header>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 glass-card border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition hover:scale-105">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <ArrowUpCircle size={20} /> <span className="text-sm font-bold tracking-wider">KAS MASUK</span>
          </div>
          <h2 className="text-3xl font-bold">Rp {stats.masuk.toLocaleString('id-ID')}</h2>
        </div>

        <div className="p-6 glass-card border border-pink-500 shadow-[0_0_15px_rgba(255,42,133,0.2)] transition hover:scale-105">
          <div className="flex items-center gap-2 text-pink-500 mb-2">
            <ArrowDownCircle size={20} /> <span className="text-sm font-bold tracking-wider">KAS KELUAR</span>
          </div>
          <h2 className="text-3xl font-bold">Rp {stats.keluar.toLocaleString('id-ID')}</h2>
        </div>

        <div className="p-6 glass-card border border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] transition hover:scale-105">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Package size={20} /> <span className="text-sm font-bold tracking-wider">KATEGORI BARANG</span>
          </div>
          <h2 className="text-3xl font-bold">{stats.stokKategori} Kategori</h2>
        </div>
      </div>

      {/* DUA KOLOM: FORM TRANSAKSI & GRID KATEGORI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PANEL KIRI: INPUT TRANSAKSI CEPAT */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Catat Transaksi</h3>
          <form onSubmit={addTransaction}>
            <label className="text-sm text-cyan-400 font-bold">Jenis Transaksi</label>
            <select 
              className="neon-input"
              value={formTx.type} 
              onChange={e => setFormTx({...formTx, type: e.target.value})}
            >
              <option value="cash_in">Pemasukan (+)</option>
              <option value="cash_out">Pengeluaran (-)</option>
            </select>

            <label className="text-sm text-cyan-400 font-bold">Jumlah (Rp)</label>
            <input 
              type="number" className="neon-input" placeholder="Misal: 50000"
              value={formTx.amount} onChange={e => setFormTx({...formTx, amount: e.target.value})}
            />

            <label className="text-sm text-cyan-400 font-bold">Keterangan</label>
            <input 
              type="text" className="neon-input" placeholder="Misal: Jual 1x Baju"
              value={formTx.desc} onChange={e => setFormTx({...formTx, desc: e.target.value})}
            />

            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all flex items-center justify-center gap-2">
              <CheckCircle size={20} /> Simpan Transaksi
            </button>
          </form>
        </div>

        {/* PANEL KANAN: MANAJEMEN KATEGORI */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Kategori Stok</h3>
            <button onClick={addCategory} className="flex items-center gap-1 bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-full text-sm font-bold transition">
              <Plus size={16} /> Tambah
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories?.map(cat => (
              <div key={cat.id} className="p-4 bg-slate-800 rounded-xl border border-slate-600 hover:border-cyan-400 transition group relative text-center">
                <span className="text-4xl block mb-2 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">{cat.icon}</span>
                <h4 className="font-bold text-sm truncate">{cat.name}</h4>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity bg-slate-900 rounded-full p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(!categories || categories.length === 0) && (
              <p className="text-slate-400 col-span-full text-center text-sm mt-4">Belum ada kategori. Klik tambah!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
