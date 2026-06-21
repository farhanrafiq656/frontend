import { Heart } from 'lucide-react';
import { useSaveListingMutation } from '../../store/apiSlice';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function QuickSaveToggle({ listingId, isSaved }) {
  const { isAuthenticated } = useAuth();
  const [saveListing, { isLoading }] = useSaveListingMutation();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please log in to save listings'); return; }
    try {
      await saveListing(listingId).unwrap();
    } catch {
      toast.error('Failed to update saved listing');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50 hover:text-red-400'}`}
      aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
    >
      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  );
}
