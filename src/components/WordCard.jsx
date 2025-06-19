import React, {useState} from "react";
import ReactCardFlip from "react-card-flip";
import styles from './wordCard.module.css'

function WordCard ({word, transcription, theme, translation}) {
      const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className={styles['react-card-flip']}>
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front side */}
      <div className={styles['card-front']} onClick={handleClick}>
        <h2>{word}</h2>
        <p><em>{transcription}</em></p>
      </div>

      {/* Back side */}
      <div className={styles['card-back']} onClick={handleClick}>
        <h2>{translation}</h2>
      </div>
    </ReactCardFlip>
    </div>
    );
}

export default WordCard;