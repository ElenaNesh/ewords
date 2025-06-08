import React, {useState} from "react";
import ReactCardFlip from "react-card-flip";

function WordCard ({word, transcription, theme, translation}) {
      const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front side */}
      <div className="card-front" onClick={handleClick}>
        <h2>{word}</h2>
        <p><em>{transcription}</em></p>
      </div>

      {/* Back side */}
      <div className="card-back" onClick={handleClick}>
        <h2>{translation}</h2>
      </div>
    </ReactCardFlip>
    );
}

export default WordCard;