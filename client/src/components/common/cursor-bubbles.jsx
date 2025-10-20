import { useEffect, useState } from 'react';

function CursorBubbles() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newBubble = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 20 + 10, // Random size between 10-30px
        color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random color
      };

      setBubbles((prev) => [...prev, newBubble]);

      // Remove bubble after animation
      setTimeout(() => {
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== newBubble.id));
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full animate-bubble"
          style={{
            left: bubble.x - bubble.size / 2,
            top: bubble.y - bubble.size / 2,
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default CursorBubbles;
