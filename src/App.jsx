import React, { useState, useEffect } from 'react';
import sunIcon from './assets/sun.svg';
import moonIcon from './assets/moon.svg';

function App() {
  const [time, setTime] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIcon, setCurrentIcon] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format waktu 12 jam
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Format tanggal
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[time.getDay()];
  const date = time.getDate();
  const month = months[time.getMonth()];
  const year = time.getFullYear();

  // Menentukan icon dan posisi berdasarkan waktu
  const isSunTime = hours >= 6 && hours < 18;

  useEffect(() => {
    // Update icon berdasarkan waktu
    const newIcon = isSunTime ? sunIcon : moonIcon;
    
    if (currentIcon !== newIcon) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIcon(newIcon);
        setIsTransitioning(false);
      }, 500); // Menunggu fade out selesai sebelum mengganti icon
    }
  }, [isSunTime]);

  // Menghitung posisi horizontal
  const calculatePosition = () => {
    let baseHour;
    if (isSunTime) {
      baseHour = hours - 6; // 0-12 range for sun
    } else {
      baseHour = hours < 6 ? hours + 18 : hours - 18; // 0-12 range for moon
    }
    
    const percentage = (baseHour + minutes / 60) / 12 * 100;
    return `${percentage}%`;
  };

  return (
    <div className='clock-section relative flex flex-col items-start p-4'>
      <div className='clock-container relative z-[999]'>
        <div className='clock-wrapper z-[999] relative overflow-visible flex flex-row items-center gap-6 justify-center bg-[#192135] rounded-4xl px-6 py-4 border border-3 border-[#E1E9F8]'>
          <div className='icon-wrapper'>
            <div className='icon w-28 h-28 bg-[#2F3C5B] rounded-3xl flex flex-col items-center justify-center overflow-hidden relative'>
              <div 
                className={`absolute transition-all duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                style={{ 
                  left: calculatePosition(),
                  transform: 'translateX(-50%)',
                }}
              >
                <div className='w-18 h-18'>
                  {currentIcon && <img 
                    className='w-full h-full' 
                    src={currentIcon} 
                    alt={isSunTime ? "sun" : "moon"} 
                  />}
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <div className='time-container flex flex-row items-end justify-center gap-2'>
              <div className='time text-[110px] font-bebas-neue text-white leading-none'>
                {formattedHours}:{formattedMinutes}
              </div>
              <div className='ampm text-[50px] font-bebas-neue text-[#E79BE4]'>
                {ampm}
              </div>
            </div>
            <div className='date font-fredoka text-lg tracking-[8px] text-[#D6DCF6] leading-none mt-[-10px] mb-2'>
              {`${dayName}, ${date} ${month} ${year}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;