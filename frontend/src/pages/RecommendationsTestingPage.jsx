import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import { useUser } from '../context/UserContext';
import recommendationsService from '../services/recommendations.service';
import './RecommendationsTestingPage.css';

const RecommendationsTestingPage = () => {
  const { visitorId } = useUser();
  const [availableModels, setAvailableModels] = useState([]);
  const [contextProductId, setContextProductId] = useState('');
  const [modelResults, setModelResults] = useState({});
  const [loadingModels, setLoadingModels] = useState({});

  useEffect(() => {
    // Load available models
    recommendationsService.getModels().then(response => {
      setAvailableModels(response.data || []);
    });
  }, []);

  const testModel = async (modelId) => {
    if (!visitorId) {
      alert('Visitor ID is required for recommendations. Please check the header.');
      return;
    }

    setLoadingModels(prev => ({ ...prev, [modelId]: true }));
    
    try {
      const response = await recommendationsService.getRecommendations({
        model: modelId,
        visitorId: visitorId,
        productId: contextProductId || null,
        pageSize: 6
      });

      setModelResults(prev => ({
        ...prev,
        [modelId]: response.data
      }));
    } catch (error) {
      console.error(`Error testing ${modelId}:`, error);
      setModelResults(prev => ({
        ...prev,
        [modelId]: { error: error.message, results: [] }
      }));
    } finally {
      setLoadingModels(prev => ({ ...prev, [modelId]: false }));
    }
  };

  const testAllModels = () => {
    if (!visitorId) {
      alert('Visitor ID is required. Please check the header.');
      return;
    }
    availableModels.forEach(model => {
      testModel(model.id);
    });
  };

  const clearResults = () => {
    setModelResults({});
  };

  const requiresContext = (modelId) => {
    return ['similar_items', 'frequently_bought_together'].includes(modelId);
  };

  return (
    <div className="recommendations-testing-page">
      <Header />
      
      <main className="container page-content">
        <div className="testing-header">
          <h1>⭐ Recommendations API Testing</h1>
          <p className="subtitle">Test all Vertex AI Recommendation models - requires Visitor ID from header</p>
        </div>

        {/* Visitor ID Notice */}
        <div className="visitor-notice">
          <div className="notice-content">
            <span className="notice-icon">👤</span>
            <div className="notice-text">
              <strong>Current Visitor ID:</strong> 
              <code>{visitorId || 'Not set'}</code>
              {!visitorId && <span className="notice-warning"> ⚠️ Required for recommendations</span>}
            </div>
          </div>
        </div>

        {/* Testing Controls */}
        <div className="testing-controls-panel">
          <div className="context-controls">
            <label className="control-label">
              Context Product ID (optional - required for Similar Items & Frequently Bought Together):
            </label>
            <div className="context-input-group">
              <input
                type="text"
                value={contextProductId}
                onChange={(e) => setContextProductId(e.target.value)}
                placeholder="e.g., GGOEGAAX0037"
                className="context-input"
              />
              {contextProductId && (
                <button 
                  onClick={() => setContextProductId('')}
                  className="clear-btn"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="control-hint">
              Enter a product ID to test context-based recommendations (Similar Items, Frequently Bought Together)
            </p>
          </div>

          <div className="action-buttons">
            <button 
              onClick={testAllModels} 
              className="test-all-btn"
              disabled={!visitorId}
            >
              Test All Models
            </button>
            <button onClick={clearResults} className="clear-results-btn">
              Clear Results
            </button>
          </div>
        </div>

        {/* Model Results Grid */}
        <div className="models-grid">
          {availableModels.map(model => (
            <div key={model.id} className="model-section">
              <div className="model-header">
                <div className="model-info">
                  <h2>{model.name}</h2>
                  <p className="model-description">{model.description}</p>
                  <div className="model-requirements">
                    {requiresContext(model.id) && (
                      <span className="requires-badge">📦 Requires Context Product</span>
                    )}
                    <span className="requires-badge visitor-required">👤 Requires Visitor ID</span>
                  </div>
                </div>
                <button
                  onClick={() => testModel(model.id)}
                  disabled={loadingModels[model.id] || !visitorId}
                  className="test-model-btn"
                  title={!visitorId ? 'Visitor ID required' : 'Test this model'}
                >
                  {loadingModels[model.id] ? 'Testing...' : 'Test Model'}
                </button>
              </div>

              <div className="model-content">
                {loadingModels[model.id] && (
                  <Loader message={`Loading ${model.name}...`} />
                )}

                {!loadingModels[model.id] && modelResults[model.id] && (
                  <>
                    {modelResults[model.id].error ? (
                      <div className="model-error">
                        <p>❌ Error: {modelResults[model.id].error}</p>
                        {requiresContext(model.id) && !contextProductId && (
                          <p className="error-hint">
                            💡 This model requires a context product. Enter a product ID above and try again.
                          </p>
                        )}
                      </div>
                    ) : modelResults[model.id].results?.length > 0 ? (
                      <>
                        <div className="model-stats">
                          <span>✅ {modelResults[model.id].results.length} recommendations returned</span>
                          {contextProductId && requiresContext(model.id) && (
                            <span>📦 Context: {contextProductId}</span>
                          )}
                          <span>👤 Visitor: {visitorId}</span>
                        </div>
                        <div className="recommendations-grid">
                          {modelResults[model.id].results.map((item, idx) => (
                            <ProductCard key={idx} product={item} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="no-recommendations">
                        <p>No recommendations returned</p>
                        <p className="hint">
                          This model may need more training data, user events, or a context product
                        </p>
                      </div>
                    )}
                  </>
                )}

                {!loadingModels[model.id] && !modelResults[model.id] && (
                  <div className="model-placeholder">
                    <p>👆 Click "Test Model" to see recommendations from this model</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {availableModels.length === 0 && (
          <div className="no-models">
            <h3>No recommendation models configured</h3>
            <p>Configure serving configs in GCP Console first</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RecommendationsTestingPage;
