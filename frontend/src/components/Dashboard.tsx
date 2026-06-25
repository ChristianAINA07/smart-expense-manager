import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TransactionForm from './TransactionForm';
import AnalyticsCharts from './AnalyticsCharts';
import TransactionsList from './TransactionsList';
import { LayoutDashboard, BarChart3, Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle, LogOut, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // 1. Fiovan-drafitra ofisialy : mampiasa autoTable mivantana

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#eab308', '#a855f7', '#64748b'];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const responseStats = await api.get('/dashboard/stats');
      const responseList = await api.get('/transactions');
      setStats(responseStats.data);
      setTransactions(responseList.data);
    } catch (err) {
      console.error("Erreur de chargement", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- LOJIKA OFISIALY SY VOAPITRA : TSY MISY CRASH INTSONY ---
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // 1. Titre Principal
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("FinTrack Pro - Rapport Financier", 14, 20);
      
      // 2. Date du rapport
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Date du rapport : ${new Date().toLocaleDateString()}`, 14, 28);
      
      // 3. Tableau Resume (KPI)
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Resume General du Mois", 14, 40);
      
      // Antsoina mivantana ny autoTable(doc, ...) ho fitaovana ofisialy
      autoTable(doc, {
        startY: 45,
        head: [['Indicateur', 'Montant']],
        body: [
          ['Total Revenus', `${stats?.totalRevenus?.toLocaleString() || 0} Ar`],
          ['Total Depenses', `${stats?.totalDepenses?.toLocaleString() || 0} Ar`],
          ['Profit Net', `${stats?.profit?.toLocaleString() || 0} Ar`],
        ],
        theme: 'grid',
        headStyles: { fillColor: '#10b981' }
      });

      // 4. Tableau Historique Detaille
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Historique des Transactions", 14, 95);

      const tableBody = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category.toUpperCase(),
        t.description || '-',
        `${t.amount.toLocaleString()} Ar`
      ]);

      autoTable(doc, {
        startY: 102,
        head: [['Date', 'Type', 'Categorie', 'Description', 'Montant']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: '#1e293b' }
      });

      // 5. Download automatique du fichier PDF
      doc.save("Rapport_Financier.pdf");
    } catch (pdfError) {
      console.error("Erreur technique de generation PDF:", pdfError);
      alert("Erreur lors de la generation du PDF. Regardez la console.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold tracking-wider text-emerald-400">FinTrack Pro</span>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 p-3 rounded-xl font-medium transition">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </a>
            <a href="#sections-transactions" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white p-3 rounded-xl font-medium transition">
              <BarChart3 className="h-5 w-5" /> Transactions
            </a>
          </nav>
        </div>
        <button onClick={onLogout} className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-3 rounded-xl font-semibold transition mt-6 cursor-pointer">
          <LogOut className="h-5 w-5" /> Deconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, Entrepreneur 👋</h1>
            <p className="text-slate-400 text-sm mt-1">Analyse visuelle et suivi en temps reel de votre activite.</p>
          </div>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-500/10 cursor-pointer transition transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" /> Exporter PDF
          </button>
        </header>

        {stats?.insights && stats.insights.length > 0 && stats.insights !== "Votre situation financière est stable pour le moment." && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-4 items-start">
            <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-400">Business Insights</h4>
              <ul className="list-disc list-inside text-sm text-amber-300/90 mt-1 space-y-1">
                {stats.insights.map((insight: string, idx: number) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Revenus</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">{stats?.totalRevenus?.toLocaleString()} Ar</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl"><ArrowUpRight className="h-6 w-6 text-emerald-400" /></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Total Depenses</p>
              <h3 className="text-2xl font-black text-rose-400 mt-2">{stats?.totalDepenses?.toLocaleString()} Ar</h3>
            </div>
            <div className="bg-rose-500/10 p-3 rounded-xl"><ArrowDownRight className="h-6 w-6 text-rose-400" /></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Profit Net</p>
              <h3 className={`text-2xl font-black mt-2 ${stats?.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stats?.profit?.toLocaleString()} Ar
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${stats?.profit >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              <Wallet className={`h-6 w-6 ${stats?.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TransactionForm onTransactionAdded={fetchDashboardData} />
          <AnalyticsCharts stats={stats} />
        </div>

<div id="sections-transactions" className="scroll-mt-6">
  <TransactionsList onDataChanged={fetchDashboardData} />
</div>      </main>
    </div>
  );
}
