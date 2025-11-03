import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import useRecommendations from '../hooks/useRecommendations';
import recommendationsService from '../services/recommendations.service';
import './RecommendationsTestingPage.css';

const RecommendationsTestingPage = () => {
  const [availableModels, setAvailableModels] = useState([]);
  const [contextProductId, setContextProductId] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);
  const [modelResults, setModelResults] = useState({});
  const [loadingModels, setLoadingModels] = useState({});

  useEffect(() => {
    // Load available models
    recommendationsService.getModels().then(response => {
      setAvailableModels(response.data || []);
    });
  }, []);

  const testModel = async (modelId) => {
    setLoadingModels(prev => ({ ...prev, [modelId]: true }));
    
    try {
      const response = await recommendationsService.getRecommendations({
        model: modelId,
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
    availableModels.forEach(model => {
      testModel(model.id);
    });
  };

  const clearResults = () => {
    setModelResults({});
  };

  return (
    <div className="recommendations-testing-page">
      <Header />
      
      <main className="container page-content">
        <div className="testing-header">
          <h1>⭐ Recommendations API Testing</h1>
          <p className="subtitle">Test all Vertex AI Recommendation models</p>
        </div>

        {/* Testing Controls */}
        <div className="testing-controls-panel">
          <div className="context-controls">
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={showContextInput}
                  onChange={(e) => setShowContextInput(e.target.checked)}
                />
                Add Context Product (for Similar Items, Frequently Bought Together)
              </label>
            </div>

            {showContextInput && (
              <div className="context-input-group">
                <input
                  type="text"
                  value={contextProductId}
                  onChange={(e) => setContextProductId(e.target.value)}
                  placeholder="Enter Product ID (e.g., GGOEGAAX0037)"
                  className="context-input"
                />
                <button 
                  onClick={() => setContextProductId('')}
                  className="clear-btn"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={testAllModels} className="test-all-btn">
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
                  {model.requires_product_id && (
                    <span className="requires-context">⚠️ Requires context product</span>
                  )}
                </div>
                <button
                  onClick={() => testModel(model.id)}
                  disabled={loadingModels[model.id]}
                  className="test-model-btn"
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
                        {model.requires_product_id && !contextProductId && (
                          <p className="error-hint">
                            This model requires a context product. Enable it above and provide a product ID.
                          </p>
                        )}
                      </div>
                    ) : modelResults[model.id].results?.length > 0 ? (
                      <>
                        <div className="model-stats">
                          <span>✅ {modelResults[model.id].results.length} recommendations</span>
                          {contextProductId && <span>📦 Context: {contextProductId}</span>}
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
                          This model may need more training data or user events
                        </p>
                      </div>
                    )}
                  </>
                )}

                {!loadingModels[model.id] && !modelResults[model.id] && (
                  <div className="model-placeholder">
                    <p>👆 Click "Test Model" to see recommendations</p>
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
