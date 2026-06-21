import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useGetAgentProfileQuery, useGetAgentReviewsQuery, useGetListingsByAgentQuery, useCreateReviewMutation } from '../store/apiSlice';
import PropertyGrid from '../components/listings/PropertyGrid';
import { reviewSchema } from '../lib/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import { Star, Globe, Instagram, Linkedin, Facebook } from 'lucide-react';

export default function AgentProfilePage() {
  const { agentId } = useParams();
  const { isAuthenticated } = useAuth();
  const { data: agent, isLoading: loadingAgent } = useGetAgentProfileQuery(agentId);
  const { data: reviews } = useGetAgentReviewsQuery(agentId);
  const { data: listingsData, isLoading: loadingListings } = useGetListingsByAgentQuery({ agentId });
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(reviewSchema) });

  const onReview = async (data) => {
    try {
      await createReview({ agentId, ...data }).unwrap();
      toast.success('Review submitted!');
      reset();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to submit review');
    }
  };

  if (loadingAgent) return <div className="max-w-4xl mx-auto py-12 px-4 text-center">Loading...</div>;
  if (!agent) return <div className="max-w-4xl mx-auto py-12 px-4 text-center">Agent not found</div>;

  const ap = agent.agentProfile;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Agent header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt={agent.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">{agent.name[0]}</div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
            {ap?.brokerageName && <p className="text-gray-500 mt-1">{ap.brokerageName}</p>}
            {ap?.licenseState && <p className="text-sm text-gray-400">Licensed in {ap.licenseState}</p>}
            {ap?.yearsOfExperience != null && <p className="text-sm text-gray-500">{ap.yearsOfExperience} years of experience</p>}
            {ap?.ratingAverage > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} size={16} className={n <= Math.round(ap.ratingAverage) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
                <span className="text-sm text-gray-600 ml-1">{ap.ratingAverage} ({ap.ratingCount} reviews)</span>
              </div>
            )}
            {/* Social Links */}
            <div className="flex gap-3 mt-3">
              {ap?.socialLinks?.website && <a href={ap.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600"><Globe size={18} /></a>}
              {ap?.socialLinks?.instagram && <a href={ap.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500"><Instagram size={18} /></a>}
              {ap?.socialLinks?.linkedin && <a href={ap.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700"><Linkedin size={18} /></a>}
              {ap?.socialLinks?.facebook && <a href={ap.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600"><Facebook size={18} /></a>}
            </div>
          </div>
        </div>
        {ap?.bio && <p className="mt-4 text-gray-700 leading-relaxed">{ap.bio}</p>}
      </div>

      {/* Listings */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Listings</h2>
        <PropertyGrid listings={listingsData?.results} loading={loadingListings} />
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
        {reviews?.length === 0 && <p className="text-gray-500 mb-4">No reviews yet.</p>}
        <div className="space-y-4 mb-6">
          {reviews?.map((r) => (
            <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                {r.reviewer?.avatarUrl ? (
                  <img src={r.reviewer.avatarUrl} alt={r.reviewer.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">{r.reviewer?.name?.[0]}</div>
                )}
                <div>
                  <div className="font-medium text-gray-900 text-sm">{r.reviewer?.name}</div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} size={12} className={n <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
            </div>
          ))}
        </div>

        {isAuthenticated && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Leave a Review</h3>
            <form onSubmit={handleSubmit(onReview)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select {...register('rating', { valueAsNumber: true })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Great</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
                {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
              </div>
              <textarea {...register('comment')} rows={3} placeholder="Share your experience..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              <button type="submit" disabled={submittingReview} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
