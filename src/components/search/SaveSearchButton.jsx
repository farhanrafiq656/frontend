import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCreateSavedSearchMutation } from '../../store/apiSlice';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function SaveSearchButton() {
  const { isAuthenticated } = useAuth();
  const filters = useSelector((s) => s.filters);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [freq, setFreq] = useState('daily');
  const [createSavedSearch, { isLoading }] = useCreateSavedSearchMutation();

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Please enter a name'); return; }
    try {
      await createSavedSearch({ name, filters, alertFrequency: freq }).unwrap();
      toast.success('Search saved!');
      setOpen(false);
      setName('');
    } catch {
      toast.error('Failed to save search');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600">
        <Bookmark size={16} /> Save Search
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">Save this search</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 3BR Austin under 500k"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alert frequency</label>
              <select value={freq} onChange={(e) => setFreq(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="instant">Instant</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
