import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageCircle, X, Send, Filter, Bed, Bath, MapPin } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { toggleChat } from '../../store/uiSlice';
import { setFilter } from '../../store/filtersSlice';
import { useSendChatMessageMutation } from '../../store/apiSlice';
import ChatMessage from './ChatMessage';
import { useNavigate, Link } from 'react-router-dom';

const getSessionId = () => {
  let id = localStorage.getItem('chat_session_id');
  if (!id) { id = uuid(); localStorage.setItem('chat_session_id', id); }
  return id;
};

function formatPrice(cents, listingType) {
  const dollars = cents / 100;
  const formatted = dollars >= 1000000
    ? `$${(dollars / 1000000).toFixed(1)}M`
    : dollars >= 1000
    ? `$${(dollars / 1000).toFixed(0)}K`
    : `$${dollars.toLocaleString()}`;
  return listingType === 'rent' ? `${formatted}/mo` : formatted;
}

function ListingCards({ listings }) {
  if (!listings?.length) return null;
  return (
    <div className="px-3 pb-2 space-y-2">
      <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wide px-1">Matching Properties</p>
      {listings.map((l) => (
        <Link
          key={l._id}
          to={`/listing/${l._id}`}
          className="flex gap-2.5 bg-[#F5F0EB] border border-[#E7DDD5] rounded-xl p-2.5 hover:border-[#7B5328] transition-colors group"
        >
          {l.image ? (
            <img src={l.image} alt="" className="w-16 h-14 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-14 rounded-lg bg-[#E7DDD5] flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#7B5328] group-hover:underline truncate">{formatPrice(l.price, l.listingType)}</p>
            <p className="text-xs text-[#1C1917] font-medium truncate">{l.title}</p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#78716C]">
              {l.features?.bedrooms && <span className="flex items-center gap-0.5"><Bed size={9} />{l.features.bedrooms}bd</span>}
              {l.features?.bathrooms && <span className="flex items-center gap-0.5"><Bath size={9} />{l.features.bathrooms}ba</span>}
              {l.address?.city && <span className="flex items-center gap-0.5"><MapPin size={9} />{l.address.city}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector((s) => s.ui.chatOpen);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI real estate assistant. Ask me to find homes by city, beds, price range, or type — I'll search our listings for you!" },
  ]);
  const [input, setInput] = useState('');
  const [pendingFilters, setPendingFilters] = useState(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [sendMessage, { isLoading }] = useSendChatMessageMutation();
  const bottomRef = useRef(null);
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingListings]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setPendingFilters(null);
    setPendingListings([]);

    try {
      const res = await sendMessage({ session_id: sessionId.current, message: input }).unwrap();
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
      if (res.extracted_filters && Object.keys(res.extracted_filters).some((k) => res.extracted_filters[k])) {
        setPendingFilters(res.extracted_filters);
      }
      if (res.listings?.length) {
        setPendingListings(res.listings);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  const applyFilters = () => {
    if (!pendingFilters) return;
    dispatch(setFilter(pendingFilters));
    navigate('/search');
    setPendingFilters(null);
    setPendingListings([]);
  };

  return (
    <>
      <button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-50 bg-[#7B5328] text-white rounded-full p-4 shadow-lg hover:bg-[#5C3D1E] transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E7DDD5] flex flex-col" style={{ height: '520px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#7B5328] text-white rounded-t-2xl flex-shrink-0">
            <div>
              <div className="font-semibold text-sm">AI Real Estate Assistant</div>
              <div className="text-xs text-white/70">Searches our live database</div>
            </div>
            <button onClick={() => dispatch(toggleChat())} className="hover:text-white/70 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-3 space-y-1">
            {messages.map((m, i) => <ChatMessage key={i} message={m} />)}
            {isLoading && (
              <div className="flex justify-start mb-3 px-3">
                <div className="bg-[#F5F0EB] rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 bg-[#A8A29E] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            {/* RAG listing cards */}
            {pendingListings.length > 0 && <ListingCards listings={pendingListings} />}
            <div ref={bottomRef} />
          </div>

          {/* Apply filters banner */}
          {pendingFilters && (
            <div className="px-4 py-2 bg-[#F5F0EB] border-t border-[#E7DDD5] flex-shrink-0">
              <button onClick={applyFilters} className="w-full flex items-center justify-center gap-2 text-sm text-[#7B5328] font-semibold py-1.5 rounded-lg hover:bg-[#E7DDD5] transition-colors">
                <Filter size={14} /> Search with these filters
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E7DDD5] flex-shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Find 3-bed homes in Austin..."
              className="flex-1 border border-[#E7DDD5] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B5328] focus:border-[#7B5328]"
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}
              className="bg-[#7B5328] text-white rounded-full p-2 hover:bg-[#5C3D1E] disabled:opacity-50 transition-colors flex-shrink-0">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
