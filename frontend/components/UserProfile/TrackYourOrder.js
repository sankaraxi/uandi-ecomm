"use client";

import { useState } from "react";
import axios from "axios";
import { Package, Truck, CheckCircle2, Clock, RefreshCw, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TrackYourOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const { data } = await axios.get(`${API_URL}/shipping/track/${encodeURIComponent(orderNumber.trim())}`);
      if (!data?.success) throw new Error(data?.message || "Tracking failed");
      setData(data.tracking);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch tracking");
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (events = []) => {
    if (!Array.isArray(events) || events.length === 0) return null;
    return (
      <div className="mt-4 space-y-3">
        {events.map((ev, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 wrap-break-word">{ev?.sr_status || ev?.current_status || ev?.event || "Update"}</p>
              {ev?.message && <p className="text-sm text-gray-600 wrap-break-word">{ev.message}</p>}
              {ev?.shipment_date && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {ev.shipment_date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const summary = data?.tracking_data || data?.data || {};
  const events = summary?.shipment_track || summary?.track_status || [];
  const status = summary?.current_status || summary?.status || "";
  const awb = summary?.awb_code || data?.awb || "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Track Your Order</h2>
      <p className="text-gray-600 mb-4">Enter your order number (e.g., U-AND-I-...) to view live shipment updates.</p>

      <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg text-sm font-semibold disabled:bg-gray-400 inline-flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4" /> Track
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">AWB</p>
                <p className="text-sm font-semibold text-gray-900">{awb || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {status || 'Status unavailable'}
            </div>
          </div>

          {renderTimeline(events)}
        </div>
      )}
    </div>
  );
}