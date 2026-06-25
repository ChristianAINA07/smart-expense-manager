import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Trash2, Edit2, ArrowUpRight, ArrowDownRight, Calendar, Tag, Check, X } from 'lucide-react';

export default function TransactionsList({ onDataChanged }: { onDataChanged: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // États pour la modification en ligne (inline editing)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fonction pour charger la liste filtrée depuis le Backend
  const loadTransactions = async () => {
    try {
      const response = await api.get(`/transactions?search=${search}`);
      setTransactions(response.data);
    } catch (err) {
      console.error("Erreur de chargement des transactions", err);
    } finally {
      setLoading(false);
    }
  };

  // Recharger la liste chaque fois que l'utilisateur tape une lettre dans la recherche
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadTransactions();
    }, 300); // Debounce de 300ms pour économiser la base de données

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Déclencher le mode édition pour une ligne
  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditAmount(t.amount.toString());
    setEditCategory(t.category);
    setEditDescription(t.description || '');
  };

  // Enregistrer les modifications d'une transaction
  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/transactions/${id}`, {
        amount: parseFloat(editAmount),
        category: editCategory,
        description: editDescription,
      });
      setEditingId(null);
      loadTransactions();
      onDataChanged(); // Rafraîchir les graphiques et KPI globaux
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  // Supprimer une transaction
  const handleDelete = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette operation ?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      loadTransactions();
      onDataChanged(); // Rafraîchir les graphiques et KPI globaux
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Barre de recherche avancée */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-200">Historique des Flux</h3>
          <p className="text-slate-400 text-xs mt-0.5">Consultez, filtrez et modifiez vos entrees et sorties d argent.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 text-xs text-slate-200 transition"
            placeholder='Rechercher "Telma", "Loyer"...'
          />
        </div>
      </div>

      {/* Tableau responsive */}
      {loading ? (
        <div className="text-center py-6 text-slate-500 text-sm">Chargement...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-sm">Aucune opération trouvée.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Date & Type</th>
                <th className="p-4">Categorie</th>
                <th className="p-4">Description</th>
                <th className="p-4">Montant</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/20 transition duration-150">
                  
                  {/* Colonne Date & Type */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.type === 'REVENU' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {t.type === 'REVENU' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div className="text-xs">
                        <p className={`font-bold ${t.type === 'REVENU' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.type}</p>
                        <p className="text-slate-500 flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3" /> {new Date(t.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>

                  {/* Colonne Catégorie (Éditables ou Fixe) */}
                  <td className="p-4">
                    {editingId === t.id ? (
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
                        <option value="vente">Vente Recette</option>
                        <option value="internet">Internet Telephone</option>
                        <option value="loyer">Loyer Bureau</option>
                        <option value="carburant">Carburant Transport</option>
                        <option value="salaire">Salaire Employes</option>
                        <option value="fournitures">Fournitures Achats</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 capitalize">
                        <Tag className="h-3 w-3" /> {t.category}
                      </span>
                    )}
                  </td>

                  {/* Colonne Description */}
                  <td className="p-4">
                    {editingId === t.id ? (
                      <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 w-full" />
                    ) : (
                      <span className="text-slate-400 text-xs">{t.description || '-'}</span>
                    )}
                  </td>

                  {/* Colonne Montant */}
                  <td className="p-4 font-bold text-sm">
                    {editingId === t.id ? (
                      <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 w-28" />
                    ) : (
                      <span className={t.type === 'REVENU' ? 'text-emerald-400' : 'text-slate-200'}>
                        {t.type === 'DEPENSE' ? '-' : '+'}{t.amount.toLocaleString()} Ar
                      </span>
                    )}
                  </td>

                  {/* Boutons Actions CRUD */}
                  <td className="p-4 text-right">
                    {editingId === t.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleUpdate(t.id)} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"><Check className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(t)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition cursor-pointer"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
