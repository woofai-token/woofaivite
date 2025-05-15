import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function TokenomicsChart() {
  useEffect(() => {
    const ctx = document.getElementById('tokenomicsChart');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Presale (50%)', 'Airdrop (10%)', 'Liquidity (33%)', 'Marketing (7%)'],
        datasets: [{
          data: [50, 10, 33, 7],
          backgroundColor: ['#00ff88', '#7b00ff', '#ff007b', '#ffd700']
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { color: '#0fef21' } } },
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    return () => chart.destroy(); // Cleanup
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <canvas id="tokenomicsChart" />
    </div>
  );
}
