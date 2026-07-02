'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import LoadingSpinner from './LoadingSpinner';

export default function AuditLogsClient() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'audit_logs'),
        orderBy('timestamp', 'desc'),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(data);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setError('Failed to load audit logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (!lastVisible || !hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'audit_logs'),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const newLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(prev => [...prev, ...newLogs]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch more audit logs:', err);
      setError('Failed to load more audit logs: ' + err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="mgmt-card">
      <div className="mgmt-card__header">
        <div className="mgmt-card__title">
          <i className="fa-solid fa-clipboard-list" style={{ marginRight: 8, color: 'var(--mgmt-accent)' }} />
          Recent Activity Logs
        </div>
        <button className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm" onClick={fetchLogs} disabled={loading}>
          <i className={`fa-solid fa-rotate-right ${loading ? 'fa-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="mgmt-card__body p-0">
        {loading && logs.length === 0 ? (
          <div className="p-24"><LoadingSpinner /></div>
        ) : error ? (
          <div className="p-24" style={{ color: '#dc2626', textAlign: 'center' }}>
            <i className="fa-solid fa-circle-exclamation mr-2" /> {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="mgmt-empty-state">
            <i className="fa-solid fa-inbox" />
            <p>No audit logs found.</p>
          </div>
        ) : (
          <div className="mgmt-table-wrapper">
            <table className="mgmt-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatTimestamp(log.timestamp)}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{log.user?.email || log.userEmail || 'Unknown'}</div>
                      <span className={`mgmt-badge ${(log.user?.role || log.userRole) === 'admin' ? 'mgmt-badge--success' : 'mgmt-badge--primary'}`}>
                        {log.user?.role || log.userRole || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className="mgmt-badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{log.resource}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{log.resourceId}</div>
                    </td>
                    <td>
                      <pre style={{ fontSize: '11px', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#f8fafc', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                        {JSON.stringify(log.details || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {hasMore && (
              <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--mgmt-border)' }}>
                <button 
                  className="mgmt-btn mgmt-btn--secondary mgmt-btn--sm" 
                  onClick={fetchMore} 
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} /> Loading...</>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
