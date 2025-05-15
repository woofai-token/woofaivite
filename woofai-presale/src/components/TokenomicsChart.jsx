import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function TokenomicsChart() {
  useEffect(() => {
    new Chart(document.getElementById('tokenomicsChart'), {
      type: 'doughnut',
      data: {
        labels: ['Presale (50%)', 'Airdrop (10%)', 'Liquidity (33%)', 'Marketing (7%)'],
        datasets: [{
          data: [50, 10, 33, 7],
          backgroundColor: ['#00ff88', '#7b00ff', '#ff007b', '#ffd700']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        responsive: true
      }
    });
  }, []);

  return (
    <canvas id="tokenomicsChart" width="400" height="400"></canvas>
  );
}
