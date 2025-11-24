import { useState, useEffect } from 'react';
import './decorations.css';
import './message.css';
import './santa.css';
import './mobile.css';
import './modal.css';
import './music.css';
import adventDay1 from './assets/advent-day-1.jpg';
import adventDay2 from './assets/advent-day-2.jpg';
import adventDay3 from './assets/advent-day-3.jpg';
import adventDay4 from './assets/advent-day-4.jpg';
import adventDay5 from './assets/advent-day-5.jpg';
import adventDay6 from './assets/advent-day-6.jpg';
import adventDay7 from './assets/advent-day-7.jpg';
import adventDay8 from './assets/advent-day-8.jpg';
import adventDay9 from './assets/advent-day-9.jpg';
import adventDay10 from './assets/advent-day-10.jpg';
import adventDay11 from './assets/advent-day-11.jpg';
import adventDay12 from './assets/advent-day-12.jpg';
import coverPhoto from './assets/cover-photo.jpg';

// --- Snowfall Component ---
const Snowfall = () => {
    useEffect(() => {
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let particles = [];
        const particleCount = 150;
        let mouse = { x: -100, y: -100 };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 3 + 1;
                this.speedY = Math.random() * 1 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                // Move down
                this.y += this.speedY;
                this.x += this.speedX;

                // Mouse interaction (repel)
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 5;
                    const directionY = forceDirectionY * force * 5;

                    this.x += directionX;
                    this.y += directionY;
                }

                // Reset if out of bounds
                if (this.y > height) {
                    this.y = -10;
                    this.x = Math.random() * width;
                }
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return <canvas id="snow-canvas" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }} />;
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

// --- Santa Component ---
const SantaSleigh = () => (
    <div className="santa-container">
        <div className="santa-speech">Ho, Ho, Ho! 🔔</div>
        <div className="santa-sleigh">🦌🦌🦌🛷🎅</div>
    </div>
);

// --- Advent Calendar Component ---
const AdventCalendar = () => {
    const [openDoors, setOpenDoors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleDoor = (day) => {
        setOpenDoors(prev => ({
            ...prev,
            [day]: !prev[day]
        }));
    };

    const handleImageClick = (e, imageSrc) => {
        e.stopPropagation(); // Prevent closing the door when clicking the image
        setSelectedImage(imageSrc);
    };

    // 12 Days of Christmas - Tree Shape Layout
    const rows = [
        [1],
        [2, 3],
        [4, 5, 6],
        [7, 8, 9, 10],
        [11, 12]
    ];

    // Surprises content
    const surprises = {
        1: adventDay1,
        2: adventDay2,
        3: adventDay3,
        4: adventDay4,
        5: adventDay5,
        6: adventDay6,
        7: adventDay7,
        8: adventDay8,
        9: adventDay9,
        10: adventDay10,
        11: adventDay11,
        12: adventDay12
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
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(day) ? (
                                            <img
                                                src={surprises[day]}
                                                alt={`Day ${day} Surprise`}
                                                onClick={(e) => handleImageClick(e, surprises[day])}
                                                style={{ cursor: 'zoom-in' }}
                                            />
                                        ) : (
                                            <span>{surprises[day]}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content">
                        <img src={selectedImage} alt="Enlarged Memory" />
                        <button className="close-modal" onClick={() => setSelectedImage(null)}>×</button>
                    </div>
                </div>
            )}
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
                    <img src={coverPhoto} alt="Merry Christmas" className="card-front-image" />
                    <div className="card-decorations">
                        <div className="garland-top"></div>
                        <div className="bell bell-left">🔔</div>
                        <div className="bell bell-right">🔔</div>
                    </div>
                    <div className="card-front-content">
                        <div className="click-hint">Click to Open ✨</div>
                    </div>
                </div>
                <div className="card-face card-inside">
                    <h2>The Vicenzino Family</h2>
                    <p className="holiday-message">
                        Wishing you a holiday season filled with love, laughter, and the warmth of family.<br />
                        Merry Christmas and a Happy New Year!
                    </p>
                    <Countdown />
                    <p className="signature">Love - Mike, Carolyn, Sebby and Jax</p>
                </div>
            </div>
        </div>
    );
};

// --- Music Player Component ---
import letItSnow from './assets/let-it-snow.mp3';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio(letItSnow));

    useEffect(() => {
        audio.loop = true;
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [audio]);

    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Error playing audio:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button className="music-btn" onClick={togglePlay}>
            {isPlaying ? '🔇 Stop Music' : '🎵 Play Music'}
        </button>
    );
};

// --- Main App Component ---
const App = () => {
    const [currentView, setCurrentView] = useState('card'); // 'card' or 'advent'

    return (
        <div className="app-container">
            <Snowfall />
            <MusicPlayer />

            <h1 className="main-title">Merry Christmas</h1>

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
                    <SantaSleigh />
                    <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>The Vicenzino Family</p>
                    <AdventCalendar />
                </>
            )}
        </div>
    );
};

export default App;
