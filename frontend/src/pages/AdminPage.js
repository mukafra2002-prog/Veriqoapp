import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { 
  Zap, Users, ShoppingBag, CreditCard, TrendingUp,
  BarChart3, Search, Filter, ChevronRight, Crown,
  CheckCircle, XCircle, AlertTriangle, Eye, Trash2,
  RefreshCw, Download, Settings, Shield, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export default function AdminPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, analysesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/analyses`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setAnalyses(analysesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      if (error.response?.status === 403) {
        toast.error('Admin access required');
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, isAdmin) => {
    try {
      await axios.patch(
        `${API_URL}/admin/users/${userId}`,
        { is_admin: isAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('User updated');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const resetUserChecks = async (userId) => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${userId}/reset-checks`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Checks reset to 3');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to reset checks');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                  <p className="text-xs text-slate-400">Veriqo Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchAdminData} className="border-white/10 text-slate-400">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
            <p className="text-emerald-400 text-xs mt-1">+{stats?.new_users_today || 0} today</p>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">Total Analyses</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.total_analyses || 0}</p>
            <p className="text-emerald-400 text-xs mt-1">+{stats?.analyses_today || 0} today</p>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Premium Users</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.premium_users || 0}</p>
            <p className="text-slate-400 text-xs mt-1">{stats?.premium_percentage || 0}% conversion</p>
          </div>

          <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Revenue (MRR)</span>
            </div>
            <p className="text-3xl font-bold text-white">${stats?.mrr || 0}</p>
            <p className="text-emerald-400 text-xs mt-1">+${stats?.revenue_today || 0} today</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'analyses', label: 'Analyses', icon: ShoppingBag },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'bg-blue-600' : 'text-slate-400'}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left p-4 text-slate-400 text-sm font-medium">User</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-medium">Plan</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-medium">Checks</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-medium">Joined</th>
                    <th className="text-left p-4 text-slate-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            {u.picture ? (
                              <img src={u.picture} alt="" className="w-full h-full rounded-full" />
                            ) : (
                              <span className="text-slate-400 text-sm">{u.name?.[0] || u.email?.[0]}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name || 'No name'}</p>
                            <p className="text-slate-500 text-sm">{u.email}</p>
                          </div>
                          {u.is_admin && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">ADMIN</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.subscription_type === 'premium' 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {u.subscription_type || 'free'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white">{u.checks_remaining === -1 ? '∞' : u.checks_remaining}</span>
                        <span className="text-slate-500">/3</span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resetUserChecks(u.id)}
                            className="border-white/10 text-slate-400 hover:text-white"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUserRole(u.id, !u.is_admin)}
                            className={u.is_admin ? 'border-red-500/30 text-red-400' : 'border-blue-500/30 text-blue-400'}
                          >
                            {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analyses Tab */}
        {activeTab === 'analyses' && (
          <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Product</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Verdict</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Score</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {analyses.slice(0, 20).map((a) => (
                  <tr key={a.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <p className="text-white font-medium truncate max-w-xs">{a.product_name}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.verdict === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                        a.verdict === 'THINK' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {a.verdict}
                      </span>
                    </td>
                    <td className="p-4 text-white">{a.confidence_score}%</td>
                    <td className="p-4 text-slate-400 text-sm">{a.user_id?.slice(0, 8)}...</td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(a.analyzed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Recent Users
              </h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm text-slate-400">
                        {u.name?.[0] || u.email?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm">{u.name || u.email}</p>
                        <p className="text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      u.subscription_type === 'premium' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500'
                    }`}>
                      {u.subscription_type || 'free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                Recent Analyses
              </h3>
              <div className="space-y-3">
                {analyses.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{a.product_name}</p>
                      <p className="text-slate-500 text-xs">{new Date(a.analyzed_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{a.confidence_score}%</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        a.verdict === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                        a.verdict === 'THINK' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {a.verdict}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict Distribution */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Verdict Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'BUY', count: stats?.verdict_buy || 0, color: 'bg-emerald-500' },
                  { label: 'THINK', count: stats?.verdict_think || 0, color: 'bg-amber-500' },
                  { label: 'AVOID', count: stats?.verdict_avoid || 0, color: 'bg-red-500' }
                ].map((item) => {
                  const total = (stats?.verdict_buy || 0) + (stats?.verdict_think || 0) + (stats?.verdict_avoid || 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white">{item.count} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4 border-white/10 text-slate-400 hover:text-white flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-xs">Export Users</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 border-white/10 text-slate-400 hover:text-white flex-col gap-2">
                  <Download className="w-5 h-5" />
                  <span className="text-xs">Export Analyses</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 border-white/10 text-slate-400 hover:text-white flex-col gap-2">
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">Reset All Checks</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 border-white/10 text-slate-400 hover:text-white flex-col gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs">View Logs</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
