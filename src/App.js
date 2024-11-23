import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importing the custom CSS file

const App = () => {
  // State variables for URL input and fetched insights
  const [url, setUrl] = useState('');
  const [insights, setInsights] = useState([]);

  // Fetch all insights on component mount
  useEffect(() => {
    fetchInsights();
  }, []);

  // Function to fetch insights from the backend
  const fetchInsights = async () => {
    try {
      const response = await axios.get('http://localhost:5000/insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error.message);
    }
  };

  // Handle form submission for URL input
  const handleSubmit = async () => {
    if (!url) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/insights', { url });
      setInsights([...insights, response.data]);
      setUrl(''); // Clear input field after submission
    } catch (error) {
      console.error('Error submitting URL:', error.response?.data || error.message);
      alert(`Failed to process URL: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle deleting an insight
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/insights/${id}`);
      fetchInsights();
    } catch (error) {
      console.error('Error deleting insight:', error.message);
    }
  };

  // Toggle favorite status of an insight
  const toggleFavorite = async (id) => {
    try {
      await axios.put(`http://localhost:5000/insights/${id}`);
      fetchInsights();
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Webpage Scraper</h1>

      {/* URL Input Section */}
      <div className="input-section">
        <input
          type="text"
          className="url-input"
          placeholder="Enter Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          Get Insights
        </button>
      </div>

      {/* Results Table */}
      <table className="results-table">
        <thead>
          <tr>
            <th>Domain</th>
            <th>Word Count</th>
            <th>Favorite</th>
            <th>Web Links</th>
            <th>Media Links</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {insights.map((insight) => (
            <tr key={insight._id}>
              <td>{insight.domain}</td>
              <td>{insight.wordCount}</td>
              <td>{insight.favorite ? 'Yes' : 'No'}</td>
              <td>
                {insight.webLinks.map((link, index) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                    Link {index + 1}
                  </a>
                ))}
              </td>
              <td>
                {insight.mediaLinks.map((link, index) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                    Media {index + 1}
                  </a>
                ))}
              </td>
              <td>
                <button className="action-button" onClick={() => toggleFavorite(insight._id)}>
                  {insight.favorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <button className="action-button delete-button" onClick={() => handleDelete(insight._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
