import React, { useEffect, useState } from "react";

export default function Countdown() {
  // Fixed end date (replace with your actual presale end date)
  const END_DATE = new Date("2025-07-10T00:00:00"); // Example: July 1, 2025
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const difference = END_DATE - now;
    
    if (difference <= 0) {
      return { 
        expired: true,
        days: 0, 
        hours: 0, 
        minutes: 0, 
        seconds: 0 
      };
    }

    return {
      expired: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format numbers to always show 2 digits
  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div style={styles.container}>
      {timeLeft.expired ? (
        <div style={styles.expiredText}>🚀 Presale Ended!</div>
      ) : (
        <>
          <div style={styles.label}>⏳ Presale 1 Ends In:</div>
          <div style={styles.timer}>
            <span style={styles.timeUnit}>
              {formatNumber(timeLeft.days)}<small>d</small>
            </span>
            <span style={styles.separator}>:</span>
            <span style={styles.timeUnit}>
              {formatNumber(timeLeft.hours)}<small>h</small>
            </span>
            <span style={styles.separator}>:</span>
            <span style={styles.timeUnit}>
              {formatNumber(timeLeft.minutes)}<small>m</small>
            </span>
            <span style={styles.separator}>:</span>
            <span style={styles.timeUnit}>
              {formatNumber(timeLeft.seconds)}<small>s</small>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: '20px 0',
    fontFamily: '"Orbitron", sans-serif',
    textAlign: 'center'
  },
  label: {
    fontSize: '18px',
    color: '#fff',
    marginBottom: '8px',
    textShadow: '0 0 8px #00d4ff'
  },
  timer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: '8px'
  },
  timeUnit: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#39ff14',
    textShadow: '0 0 10px #39ff14',
    minWidth: '50px'
  },
  separator: {
    fontSize: '24px',
    color: '#ff66cc',
    margin: '0 2px'
  },
  expiredText: {
    fontSize: '24px',
    color: '#ff66cc',
    fontWeight: 'bold',
    textShadow: '0 0 10px #ff66cc'
  }
};