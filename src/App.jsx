import { useState, useEffect } from 'react';

// --- Snowfall Component ---
const Snowfall = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + 'vw',
            animationDuration: Math.random() * 3 + 2 + 's',
            animationDelay: Math.random() * 5 + 's',
            opacity: Math.random()
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="snow-container">
            {snowflakes.map(flake => (
                <div
                    key={flake.id}
                    className="snowflake"
                    style={{
                        left: flake.left,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        opacity: flake.opacity
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
};

// --- Countdown Component ---
const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const year = new Date().getFullYear();
        const christmas = new Date(year, 11, 25); // Month is 0-indexed
        const now = new Date();

        // If Christmas passed this year, count to next year
        if (now > christmas) {
            christmas.setFullYear(year + 1);
        }

        const difference = christmas - now;

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-container">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="time-box">
                    <span className="time-value">{value}</span>
                    <span className="time-label">{unit}</span>
                </div>
            ))}
        </div>
    );
};

// --- Gallery Component ---
const Gallery = () => {
    const [photos, setPhotos] = useState([]);

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(prev => [...prev, {
                    id: Date.now(),
                    src: reader.result,
                    rotation: Math.random() * 10 - 5 + 'deg' // Random rotation for polaroid look
                }]);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="gallery-section">
            <h2>Family Memories</h2>
            <label className="upload-btn">
                Add a Photo 📸
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                />
            </label>

            <div className="gallery-grid">
                {photos.length === 0 && <p style={{ gridColumn: '1/-1', fontStyle: 'italic' }}>No photos yet. Add some cheer!</p>}
                {photos.map(photo => (
                    <div key={photo.id} className="photo-card" style={{ '--rotation': photo.rotation }}>
                        <img src={photo.src} alt="Family memory" />
                        <div className="photo-caption">Christmas {new Date().getFullYear()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Advent Calendar Component ---
const AdventCalendar = () => {
    const [openDoors, setOpenDoors] = useState({});

    const toggleDoor = (day) => {
        setOpenDoors(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
    };

    // 12 Days of Christmas - Tree Shape Layout
    const rows = [
        [1],
        [2, 3],
        [4, 5, 6],
        [7, 8, 9, 10],
        [11, 12]
    ];

    // Placeholder images
    const surprises = {
        1: '🎄', 2: '🎅', 3: '⛄', 4: '🎁',
        5: '🦌', 6: '🍪', 7: '🥛', 8: '🕯️',
        9: '🔔', 10: '🎶', 11: '🌟', 12: '👼'
    };

    return (
        <div className="advent-section">
            <h2>12 Days of Christmas</h2>
            <div className="advent-tree">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="tree-row">
                        {row.map(day => (
                            <div
                                key={day}
                                className={`advent-door ${openDoors[day] ? 'open' : ''}`}
                                onClick={() => toggleDoor(day)}
                            >
                                <div className="advent-door-inner">
                                    <div className="advent-door-front">{day}</div>
                                    <div className="advent-door-back">
                                        <span>{surprises[day]}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Christmas Card Component ---
const ChristmasCard = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card-scene">
            <div
                className={`card-container ${isOpen ? 'open' : ''}`}
                onClick={() => !isOpen && setIsOpen(true)}
            >
                <div className="card-face card-front">
                    <h1>Merry<br />Christmas</h1>
                    <div className="click-hint">Click to Open ✨</div>
                </div>
                <div className="card-face card-inside">
                    <h2>The Vicenzino Family</h2>
                    <Countdown />
                    <Gallery />
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [currentView, setCurrentView] = useState('card'); // 'card' or 'advent'

    return (
        <div className="app-container">
            <Snowfall />

            <nav className="nav-container">
                <button
                    className={`nav-pill ${currentView === 'card' ? 'active' : ''}`}
                    onClick={() => setCurrentView('card')}
                >
                    Christmas Card 🎄
                </button>
                <button
                    className={`nav-pill ${currentView === 'advent' ? 'active' : ''}`}
                    onClick={() => setCurrentView('advent')}
                >
                    Advent Calendar 🎁
                </button>
            </nav>

            {currentView === 'card' ? (
                <ChristmasCard />
            ) : (
                <>
                    <h1>Merry Christmas!</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>The Vicenzino Family</p>
                    <AdventCalendar />
                </>
            )}
        </div>
    );
};

export default App;
