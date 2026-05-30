import React, { useState, useEffect } from 'react';

function App() {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    layer: 'Frontend Interface',
    diagnostics: ''
  });

  // 🎛️ Active Memory baseline state filter engine
  const [filterStatus, setFilterStatus] = useState('Show All');

  const [showModal, setShowModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);

  const API_URL = 'http://localhost:5000/api/logs';

  const fetchLogs = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching data stream pipeline:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.diagnostics.trim()) return;

    const payload = {
      title: formData.title,
      layer: formData.layer,
      diagnostics: formData.diagnostics,
      parameters: formData.diagnostics,
      description: formData.diagnostics
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({ title: '', layer: 'Frontend Interface', diagnostics: '' });
        fetchLogs();
      }
    } catch (error) {
      console.error("Data dispatch pipeline crash:", error);
    }
  };

  const confirmPurge = (id) => {
    setSelectedLogId(id);
    setShowModal(true);
  };

  const handleExecutePurge = async () => {
    if (!selectedLogId) return;
    try {
      const response = await fetch(`${API_URL}/${selectedLogId}`, { method: 'DELETE' });
      if (response.ok) fetchLogs();
    } catch (error) {
      console.error("Purge operations pipeline failure:", error);
    } finally {
      setShowModal(false);
      setSelectedLogId(null);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterStatus === 'Show All') return true;
    const itemLayer = log.layer || log.category || '';
    return itemLayer.toLowerCase().trim() === filterStatus.toLowerCase().trim();
  });

  return (
    <div className="container">
      <header>
        <h1>🚀 DevLog Pro Control Center</h1>
      </header>

      <div className="main-layout">
        <section className="form-panel">
          <h2>New Log Matrix</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>OPERATION TITLE</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Session marker summary..."
                required
              />
            </div>

            <div className="form-group">
              <label>ARCHITECTURE LAYER</label>
              <select name="layer" value={formData.layer} onChange={handleChange}>
                <option value="Frontend Interface">Frontend Interface</option>
                <option value="Backend Engine">Backend Engine</option>
                <option value="Database Ledger">Database Ledger</option>
                <option value="Security Protocol">Security Protocol</option>
              </select>
            </div>

            <div className="form-group">
              <label>PROCESS DIAGNOSTICS</label>
              <textarea
                name="diagnostics"
                value={formData.diagnostics}
                onChange={handleChange}
                placeholder="Logs, analytical entries or build records..."
                required
              />
            </div>

            <button type="submit" className="submit-btn">Commit to Stream</button>
          </form>
        </section>

        <section className="stream-panel">
          <h2>📝 Live Stream Activity</h2>
          
          {/* ⚡ HIGHLY INTERACTIVE RGB FILTER PANEL BUTTONS */}
          <div className="matrix-filter-container">
            {[
              { id: 'Show All', label: '🌐 Show All' },
              { id: 'Frontend Interface', label: '🎨 Frontend' },
              { id: 'Backend Engine', label: '⚙️ Backend' },
              { id: 'Database Ledger', label: '🗄️ Database' },
              { id: 'Security Protocol', label: '🛡️ Security' }
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                className={`matrix-filter-btn ${filterStatus === btn.id ? 'matrix-active' : ''}`}
                onClick={() => setFilterStatus(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="logs-container">
            {filteredLogs.length === 0 ? (
              <div className="empty-state-card">
                <p className="no-logs">No operational sequences matching "{filterStatus}" found.</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const layerStr = log.layer || log.category || 'Frontend Interface';
                const badgeClass = layerStr.toLowerCase().includes('backend') ? 'backend' :
                                   layerStr.toLowerCase().includes('database') ? 'database' :
                                   layerStr.toLowerCase().includes('security') ? 'security' : 'frontend';
                
                const targetId = log.id || log._id;
                const displayParameters = log.diagnostics || log.parameters || log.description || 'No parameters recorded.';

                return (
                  <div key={targetId || Math.random()} className="log-card animate-card-entry">
                    <div className="card-header">
                      <h3>{log.title || 'Untitled Operation'}</h3>
                      <span className={`badge ${badgeClass}`}>
                        {layerStr.toUpperCase()}
                      </span>
                    </div>
                    <p className="diagnostics-text">{displayParameters}</p>
                    <div className="card-footer">
                      <span className="timestamp">⚡ System Timestamp: {log.timestamp || new Date().toLocaleString()}</span>
                      <button className="purge-btn" onClick={() => confirmPurge(targetId)}>Purge</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>⚠️ Confirm Destructive Action</h3>
            <p>Are you sure you want to purge this operational sequence?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleExecutePurge}>Confirm Purge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;