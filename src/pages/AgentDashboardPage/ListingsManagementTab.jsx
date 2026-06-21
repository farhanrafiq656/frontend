import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { getApiBaseUrl } from '../../lib/apiBase';
import {
  useGetListingsByAgentQuery, useCreateListingMutation, useUpdateListingMutation,
  useDeleteListingMutation, useGenerateDescriptionMutation,
  useAddListingImageMutation,
} from '../../store/apiSlice';
import { Plus, Trash2, Eye, Sparkles, Upload, X, Home, Edit2, Check } from 'lucide-react';

const PROPERTY_TYPES = ['house', 'condo', 'townhouse', 'multi-family', 'land', 'commercial', 'manufactured'];
const AMENITIES = [
  'air_conditioning','in_unit_laundry','fireplace','hardwood_floors','updated_kitchen',
  'walk_in_closet','finished_basement','pool','backyard','deck_patio','balcony',
  'fenced_yard','waterfront','mountain_view','ocean_view','elevator','gym',
  'doorman','gated_community','pet_friendly','furnished','ada_accessible','solar_panels','ev_charging',
];
const STEPS = ['Basics', 'Location', 'Features', 'Amenities', 'Photos', 'Description', 'Review'];

const inputCls = 'w-full border border-[#E7DDD5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] focus:border-[#7B5328] bg-white';
const labelCls = 'block text-sm font-medium text-[#44403C] mb-1';

export default function ListingsManagementTab() {
  const { user } = useAuth();
  const [mode, setMode] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [step, setStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useGetListingsByAgentQuery({ agentId: user?._id }, { skip: !user?._id });
  const [createListing, { isLoading: creating }] = useCreateListingMutation();
  const [updateListing, { isLoading: updating }] = useUpdateListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  const [generateDesc, { isLoading: generatingDesc }] = useGenerateDescriptionMutation();
  const [addImage] = useAddListingImageMutation();

  const { register, handleSubmit, watch, setValue, getValues, reset, formState: { errors } } = useForm();

  const openCreate = () => {
    reset();
    setSelectedAmenities([]);
    setImages([]);
    setStep(0);
    setEditTarget(null);
    setMode('create');
  };

  const openEdit = (listing) => {
    reset({
      title: listing.title,
      description: listing.description,
      listingType: listing.listingType,
      propertyType: listing.propertyType,
      price: Math.round(listing.price / 100),
      address: listing.address,
      features: listing.features,
    });
    setSelectedAmenities(listing.amenities || []);
    setImages(listing.images || []);
    setStep(0);
    setEditTarget(listing);
    setMode('edit');
  };

  const closeForm = () => {
    setMode(null);
    setEditTarget(null);
    setStep(0);
    setImages([]);
    setSelectedAmenities([]);
    reset();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteListing(id).unwrap();
      toast.success('Listing deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const baseUrl = getApiBaseUrl().replace(/\/api$/, '');
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${baseUrl}/api/uploads/image`, {
          method: 'POST',
          body: fd,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, { url: data.url, publicId: data.publicId, isCover: prev.length === 0 }]);
        } else {
          toast.error(data.message || 'Upload failed');
        }
      }
      toast.success('Images uploaded');
    } catch { toast.error('Image upload failed'); }
    setUploading(false);
  };

  const handleGenerateDesc = async () => {
    const vals = getValues();
    try {
      const res = await generateDesc({
        bedrooms: parseInt(vals.features?.bedrooms) || 0,
        bathrooms: parseFloat(vals.features?.bathrooms) || 0,
        square_footage: parseInt(vals.features?.squareFootage) || 0,
        property_type: vals.propertyType || 'house',
        city: vals.address?.city || '',
        state: vals.address?.state || '',
        key_features: selectedAmenities.slice(0, 10),
        tone: 'professional',
      }).unwrap();
      setValue('description', res.description);
      if (res.seo_title_suggestion && !getValues('title')) setValue('title', res.seo_title_suggestion);
      toast.success('Description generated!');
    } catch { toast.error('Failed to generate description'); }
  };

  const onFinalSubmit = async () => {
    const vals = getValues();
    const payload = {
      ...vals,
      price: parseInt(vals.price) * 100,
      hoaFeeCents: parseInt(vals.hoaFeeCents || 0) * 100,
      features: {
        ...vals.features,
        bedrooms: parseInt(vals.features?.bedrooms),
        bathrooms: parseFloat(vals.features?.bathrooms),
        squareFootage: parseInt(vals.features?.squareFootage),
        yearBuilt: parseInt(vals.features?.yearBuilt),
        garageSpaces: parseInt(vals.features?.garageSpaces || 0),
        stories: parseInt(vals.features?.stories || 1),
      },
      amenities: selectedAmenities,
    };

    try {
      if (mode === 'edit' && editTarget) {
        await updateListing({ id: editTarget._id, ...payload }).unwrap();
        toast.success('Listing updated!');
      } else {
        const created = await createListing(payload).unwrap();
        for (const img of images) {
          try { await addImage({ id: created._id, ...img }).unwrap(); } catch (_) {}
        }
        toast.success('Listing published!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} listing`);
    }
  };

  // ── Listings list view ─────────────────────────────────────────────────────
  if (!mode) {
    const listings = data?.results || [];
    return (
      <div>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#1C1917]">My Listings</h2>
            <p className="text-sm text-[#A8A29E]">{data?.pagination?.totalCount || 0} total</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-[#7B5328] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#5C3D1E] transition-colors">
            <Plus size={16} /> Add Listing
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map((n) => <div key={n} className="h-20 bg-white rounded-2xl animate-pulse border border-[#E7DDD5]" />)}
          </div>
        ) : !listings.length ? (
          <div className="bg-white rounded-2xl border border-[#E7DDD5] p-16 text-center">
            <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-[#A8A29E]" />
            </div>
            <p className="font-semibold text-[#1C1917] mb-1">No listings yet</p>
            <p className="text-sm text-[#A8A29E] mb-4">Add your first property listing to get started</p>
            <button onClick={openCreate} className="bg-[#7B5328] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#5C3D1E] transition-colors">
              Add Your First Listing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => {
              const cover = l.images?.find((i) => i.isCover) || l.images?.[0];
              return (
                <div key={l._id} className="bg-white border border-[#E7DDD5] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#7B5328] transition-colors group">
                  {cover ? (
                    <img src={cover.url} alt="" className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center flex-shrink-0">
                      <Home size={16} className="text-[#A8A29E]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#1C1917] truncate">{l.title}</div>
                    <div className="text-sm text-[#78716C]">{l.address?.city}, {l.address?.state} · <span className="capitalize">{l.listingType}</span> · <span className="font-medium text-[#7B5328]">${(l.price / 100).toLocaleString()}</span></div>
                    <div className="text-xs text-[#A8A29E] mt-0.5">{l.features?.bedrooms}bd · {l.features?.bathrooms}ba · {l.viewCount || 0} views · {l.favoriteCount || 0} saves</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={`/listing/${l._id}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 text-[#A8A29E] hover:text-[#7B5328] rounded-xl hover:bg-[#F5F0EB] transition-colors" title="View">
                      <Eye size={16} />
                    </a>
                    <button onClick={() => openEdit(l)}
                      className="p-2 text-[#A8A29E] hover:text-[#7B5328] rounded-xl hover:bg-[#F5F0EB] transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(l._id)}
                      className="p-2 text-[#A8A29E] hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {/* Status badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 capitalize ${l.status === 'available' ? 'bg-green-100 text-green-700' : l.status === 'sold' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}`}>
                    {l.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Form view (create or edit) ─────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#1C1917]">{mode === 'edit' ? 'Edit Listing' : 'Add New Listing'}</h2>
          {mode === 'edit' && <p className="text-sm text-[#A8A29E] truncate max-w-xs">{editTarget?.title}</p>}
        </div>
        <button onClick={closeForm} className="text-[#A8A29E] hover:text-[#1C1917] transition-colors"><X size={20} /></button>
      </div>

      {/* Step pills */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => i < step ? setStep(i) : undefined}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${i === step ? 'bg-[#7B5328] text-white' : i < step ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200' : 'bg-[#F5F0EB] text-[#A8A29E]'}`}>
            {i < step ? <Check size={10} className="inline mr-1" strokeWidth={3} /> : null}{s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E7DDD5] p-6 shadow-sm space-y-4">
        {/* Step 0: Basics */}
        {step === 0 && (
          <>
            <div>
              <label className={labelCls}>Listing Type</label>
              <select {...register('listingType')} className={inputCls}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Property Type</label>
              <select {...register('propertyType')} className={inputCls}>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t.replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Price (USD)</label>
              <input {...register('price')} type="number" placeholder="500000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select {...register('status')} className={inputCls}>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <>
            {[['street','Street Address'],['city','City'],['state','State'],['zip','ZIP Code'],['neighborhood','Neighborhood']].map(([f, l]) => (
              <div key={f}>
                <label className={labelCls}>{l}</label>
                <input {...register(`address.${f}`)} className={inputCls} placeholder={f === 'neighborhood' ? 'Optional' : ''} />
              </div>
            ))}
          </>
        )}

        {/* Step 2: Features */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {[['bedrooms','Bedrooms'],['bathrooms','Bathrooms'],['squareFootage','Square Footage'],['lotSize','Lot Size (sqft)'],['yearBuilt','Year Built'],['stories','Stories'],['garageSpaces','Garage Spaces']].map(([f, l]) => (
              <div key={f}>
                <label className={labelCls}>{l}</label>
                <input {...register(`features.${f}`)} type="number" className={inputCls} />
              </div>
            ))}
            <div>
              <label className={labelCls}>Parking</label>
              <select {...register('features.parkingType')} className={inputCls}>
                {['garage','driveway','street','none'].map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Amenities */}
        {step === 3 && (
          <div>
            <p className="text-sm text-[#78716C] mb-3">{selectedAmenities.length} selected</p>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const active = selectedAmenities.includes(a);
                return (
                  <button key={a} type="button"
                    onClick={() => setSelectedAmenities((prev) => active ? prev.filter((x) => x !== a) : [...prev, a])}
                    className={`px-3 py-1.5 rounded-full text-sm border capitalize transition-colors ${active ? 'bg-[#7B5328] text-white border-[#7B5328]' : 'border-[#E7DDD5] text-[#44403C] hover:border-[#7B5328]'}`}>
                    {a.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div>
            <label className={labelCls}>Upload Photos</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E7DDD5] rounded-2xl cursor-pointer hover:border-[#7B5328] hover:bg-[#F5F0EB] transition-colors">
              <Upload size={24} className="text-[#A8A29E] mb-1" />
              <span className="text-sm text-[#A8A29E]">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
            {images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.url} alt="" className="w-20 h-16 rounded-xl object-cover" />
                    {img.isCover && (
                      <span className="absolute bottom-1 left-1 bg-[#7B5328] text-white text-[9px] font-bold px-1 rounded">Cover</span>
                    )}
                    <button onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={9} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {mode === 'edit' && <p className="text-xs text-[#A8A29E] mt-2">Note: existing images are kept. New uploads will be added.</p>}
          </div>
        )}

        {/* Step 5: Description */}
        {step === 5 && (
          <div>
            <label className={labelCls}>Title</label>
            <input {...register('title')} className={`${inputCls} mb-4`} placeholder="Property title" />
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls}>Description</label>
              <button type="button" onClick={handleGenerateDesc} disabled={generatingDesc}
                className="flex items-center gap-1 text-xs text-[#7B5328] hover:underline disabled:opacity-50 font-semibold">
                <Sparkles size={12} /> {generatingDesc ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea {...register('description')} rows={6} className={`${inputCls} resize-none`} placeholder="Describe this property..." />
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div className="bg-[#F5F0EB] rounded-xl p-5 text-sm text-[#44403C] space-y-2 border border-[#E7DDD5]">
            <p><strong className="text-[#1C1917]">Type:</strong> {watch('listingType')} / {watch('propertyType')}</p>
            <p><strong className="text-[#1C1917]">Price:</strong> ${parseInt(watch('price') || 0).toLocaleString()}</p>
            <p><strong className="text-[#1C1917]">Address:</strong> {watch('address.street')}, {watch('address.city')}, {watch('address.state')} {watch('address.zip')}</p>
            <p><strong className="text-[#1C1917]">Beds / Baths:</strong> {watch('features.bedrooms')} bd / {watch('features.bathrooms')} ba</p>
            <p><strong className="text-[#1C1917]">Sqft:</strong> {parseInt(watch('features.squareFootage') || 0).toLocaleString()}</p>
            <p><strong className="text-[#1C1917]">Amenities:</strong> {selectedAmenities.length} selected</p>
            <p><strong className="text-[#1C1917]">Photos:</strong> {images.length} uploaded</p>
            <p><strong className="text-[#1C1917]">Title:</strong> {watch('title') || '—'}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-5">
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="px-5 py-2.5 border border-[#E7DDD5] rounded-xl text-sm font-medium text-[#44403C] hover:border-[#7B5328] transition-colors">
            Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="flex-1 bg-[#7B5328] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#5C3D1E] transition-colors">
            Next
          </button>
        ) : (
          <button onClick={onFinalSubmit} disabled={creating || updating}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
            {(creating || updating) ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Publish Listing'}
          </button>
        )}
      </div>
    </div>
  );
}
