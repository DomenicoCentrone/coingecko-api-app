import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [coins, setCoins] = useState([]);
    const [sortOrder, setSortOrder] = useState({ field: '', direction: '' }); 
    const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/markets';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(COINGECKO_API, {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        limit: 10,
                        lang: 'it',
                        sparkline: true,
                        price_change_percentage: '1h,24h,7d',
                    },
                });
                setCoins(response.data);
            } catch (error) {
                console.error('Errore durante il recupero delle informazioni:', error);
            }
        };

        fetchData();
    }, []);

      // Funzione per gestire il filtraggio
      const handleSort = (field) => {
        let direction = 'asc';
        if (sortOrder.field === field && sortOrder.direction === 'asc') {
            direction = 'desc';
        }

        const sortedCoins = [...coins].sort((a, b) => {
            if (direction === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });

        setCoins(sortedCoins);
        setSortOrder({ field, direction });
      };

      const getSortIndicator = (field) => {
        if (sortOrder.field === field) {
            return sortOrder.direction === 'asc' ? '▲' : '▼';
        }
        return '';
      };

    return (
      <div className="container">
          <img src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png" height="50" alt="logo"></img>
          <h1>Top 10 Criptovalute</h1>
          <table>
              <thead>
                  <tr>
                      <th>Immagine</th>
                      <th onClick={() => handleSort('name')}><span className="symbolFil">{getSortIndicator('name')}</span> Nome</th>
                      <th onClick={() => handleSort('current_price')}><span className="symbolFil">{getSortIndicator('current_price')}</span> Prezzo</th>
                      <th onClick={() => handleSort('price_change_percentage_1h_in_currency')}><span className="symbolFil">{getSortIndicator('price_change_percentage_1h_in_currency')}</span> 1h</th>
                      <th onClick={() => handleSort('price_change_percentage_24h_in_currency')}><span className="symbolFil">{getSortIndicator('price_change_percentage_24h_in_currency')}</span> 24h</th>
                      <th onClick={() => handleSort('price_change_percentage_7d_in_currency')}><span className="symbolFil">{getSortIndicator('price_change_percentage_7d_in_currency')}</span> 7d</th>
                      <th onClick={() => handleSort('total_volume')}><span className="symbolFil">{getSortIndicator('total_volume')}</span> 24h volume</th>
                      <th onClick={() => handleSort('market_cap')}><span className="symbolFil">{getSortIndicator('market_cap')}</span> Mkt Cap</th>
                  </tr>
              </thead>
              <tbody>
                  {coins.map(coin => (
                      <tr key={coin.id}>
                          <td className="coin-image-cell">
                              <img src={coin.image} alt={coin.name} width="30" height="30"/> {/* 2. Aggiunto cella per l'immagine */}
                          </td>
                          <td>{coin.name}</td>
                          <td>${coin.current_price.toFixed(2)}</td>
                          <td className={coin.price_change_percentage_1h_in_currency >= 0 ? 'positive' : 'negative'}>
                              {coin.price_change_percentage_1h_in_currency.toFixed(2)}%
                          </td>
                          <td className={coin.price_change_percentage_24h_in_currency >= 0 ? 'positive' : 'negative'}>
                              {coin.price_change_percentage_24h_in_currency.toFixed(2)}%
                          </td>
                          <td className={coin.price_change_percentage_7d_in_currency >= 0 ? 'positive' : 'negative'}>
                              {coin.price_change_percentage_7d_in_currency.toFixed(2)}%
                          </td>
                          <td>${coin.total_volume.toLocaleString()}</td>
                          <td>${coin.market_cap.toLocaleString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default Dashboard;
