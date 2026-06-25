import React, { useState } from 'react';
import api from '../api/axios';
import { PlusCircle } from 'lucide-react';

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [type, setType] = useState('DEPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('internet');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Veuillez entrer un montant superieur a 0.');
      return;
    }

    try {
      await api.post('/transactions', {
        type,
        amount: parseFloat(amount),
        category,
        description,
      });

      setFormSuccess('Operation enregistree avec succes.');
      setAmount('');
      setDescription('');
      onTransactionAdded();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur lors de enregistrement.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <PlusCircle className="h-5 w-5" />
        <h3 className="font-bold text-lg text-slate-200">Ajouter une Operation</h3>
      </div>

      {formSuccess && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-medium mb-3">{formSuccess}</div>}
      {formError && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-medium mb-3">{formError}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Type d operation</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setType('REVENU')} className={`p-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${type === 'REVENU' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              REVENU
            </button>
            <button type="button" onClick={() => setType('DEPENSE')} className={`p-2.5 rounded-xl font-bold text-xs cursor-pointer transition ${type === 'DEPENSE' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              DEPENSE
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Montant Ar</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200" placeholder="Ex: 250000" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Categorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200 cursor-pointer">
            <option value="vente">Vente Recette</option>
            <option value="internet">Internet Telephone</option>
            <option value="loyer">Loyer Bureau</option>
            <option value="carburant">Carburant Transport</option>
            <option value="salaire">Salaire Employes</option>
            <option value="fournitures">Fournitures Achats</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description Optionnel</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200" placeholder="Ex: Facture Telma" />
        </div>

        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-extrabold p-3 rounded-xl text-sm tracking-wide shadow-md cursor-pointer transition">
          Enregistrer operation
        </button>
      </form>
    </div>
  );
}
