import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, BellOff, Trash2, Plus, RefreshCw, ArrowLeft, TrendingDown, DollarSign, ExternalLink } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function PriceAlertsPage() {
  const { user, token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ product_url: '', target_price: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchAlerts();
    }
  }, [token]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/price-alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(response.data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.product_url) return;
    
    setAdding(true);
    setError('');
    
    try {
      const payload = {
        product_url: newAlert.product_url,
        target_price: newAlert.target_price ? parseFloat(newAlert.target_price) : null
      };
      
      await axios.post(`${API_URL}/api/price-alerts`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewAlert({ product_url: '', target_price: '' });
      setShowAddForm(false);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create alert');
    } finally {
      setAdding(false);
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await axios.delete(`${API_URL}/api/price-alerts/${alertId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  const toggleAlert = async (alertId) => {
    try {
      const response = await axios.put(`${API_URL}/api/price-alerts/${alertId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.map(a => 
        a.id === alertId ? { ...a, is_active: response.data.is_active } : a
      ));
    } catch (err) {
      console.error('Failed to toggle alert:', err);
    }
  };

  const checkAllAlerts = async () => {
    setChecking(true);
    try {
      const response = await axios.post(`${API_URL}/api/price-alerts/check`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.price_drops > 0) {
        alert(`🎉 ${response.data.price_drops} price drop(s) found! Check your email.`);
      } else {
        alert('No price drops found. We\'ll keep watching!');
      }
      
      fetchAlerts();
    } catch (err) {
      console.error('Failed to check alerts:', err);
    } finally {
      setChecking(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Bell className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Price Drop Alerts</h2>
            <p className="text-slate-400 mb-6">Sign in to set up price drop alerts for your favorite products.</p>
            <Link to="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-emerald-500">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/home" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Price Drop Alerts
                </h1>
                <p className="text-sm text-slate-400">Get notified when prices drop</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkAllAlerts}
                disabled={checking || alerts.length === 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                Check Now
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-emerald-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Alert Form */}
        {showAddForm && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Create Price Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addAlert} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Amazon Product URL</label>
                  <Input
                    type="url"
                    placeholder="https://www.amazon.com/dp/..."
                    value={newAlert.product_url}
                    onChange={(e) => setNewAlert({ ...newAlert, product_url: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Target Price (optional)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Alert when price drops below this"
                    value={newAlert.target_price}
                    onChange={(e) => setNewAlert({ ...newAlert, target_price: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty for 10% drop alert</p>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" disabled={adding} className="bg-gradient-to-r from-blue-500 to-emerald-500">
                    {adding ? 'Creating...' : 'Create Alert'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="border-slate-600 text-slate-300">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Price Alerts Yet</h3>
              <p className="text-slate-400 mb-6">Start tracking prices by adding a product alert.</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-blue-500 to-emerald-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`bg-slate-800 border-slate-700 ${!alert.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {alert.product_image ? (
                      <img
                        src={alert.product_image}
                        alt={alert.product_name}
                        className="w-20 h-20 object-contain bg-white rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-white font-medium line-clamp-2">{alert.product_name}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            {alert.original_price && (
                              <span className="text-slate-400 text-sm">
                                Original: <span className="text-white">${alert.original_price.toFixed(2)}</span>
                              </span>
                            )}
                            {alert.current_price && (
                              <span className="text-slate-400 text-sm">
                                Current: <span className={alert.price_dropped ? 'text-emerald-400 font-bold' : 'text-white'}>
                                  ${alert.current_price.toFixed(2)}
                                </span>
                              </span>
                            )}
                            {alert.target_price && (
                              <span className="text-slate-400 text-sm">
                                Target: <span className="text-blue-400">${alert.target_price.toFixed(2)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {alert.price_dropped && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Price Dropped!
                            </Badge>
                          )}
                          {alert.is_active ? (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                          ) : (
                            <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Paused</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAlert(alert.id)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          {alert.is_active ? (
                            <>
                              <BellOff className="w-4 h-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Bell className="w-4 h-4 mr-1" />
                              Resume
                            </>
                          )}
                        </Button>
                        <a
                          href={`${alert.product_url}${alert.product_url.includes('?') ? '&' : '?'}tag=framouka-20`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Amazon
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteAlert(alert.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {alert.last_checked && (
                        <p className="text-xs text-slate-500 mt-2">
                          Last checked: {new Date(alert.last_checked).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
