import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { 
  Heart, Trash2, ExternalLink, Search, Loader2,
  ShoppingBag, ArrowRight, Clock, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function WishlistPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    setRemoving(itemId);
    try {
      await axios.delete(`${API_URL}/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const analyzeProduct = (url) => {
    navigate('/home', { state: { analyzeUrl: url } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
              <p className="text-slate-400 text-sm">Products saved for later analysis</p>
            </div>
          </div>
          <Link to="/home">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Wishlist */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-white/5">
            <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Save Amazon products you want to analyze later. Just paste a URL and click the heart icon.
            </p>
            <Link to="/home">
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600">
                Start Adding Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {wishlist.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.product_name}</h3>
                    {item.notes && (
                      <p className="text-slate-400 text-sm mt-1 line-clamp-1">{item.notes}</p>
                    )}
                    <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Added {new Date(item.added_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => analyzeProduct(item.product_url)}
                      className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                    <a 
                      href={`${item.product_url}${item.product_url.includes('?') ? '&' : '?'}tag=framouka-20`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="border-white/10 text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removing === item.id}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      {removing === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
