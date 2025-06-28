import React, {useState, useEffect, useRef} from "react";
import ReactCardFlip from "react-card-flip";
import styles from './wordCard.module.css'

function WordCard ({word, transcription, theme, translation, studiedCount, totalWords, currentIndex, onWordStudied}) {
      const [isFlipped, setIsFlipped] = useState(false);
      const translateButtonRef = useRef(null); // Создаем ref для кнопки

  // Сбрасываем карточку на переднюю сторону при смене карточки
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]); // Также изменим зависимость здесь для консистентности

  // Устанавливаем фокус на кнопку при смене карточки
  useEffect(() => {
    if (translateButtonRef.current) {
      translateButtonRef.current.focus();
    }
  }, [currentIndex]); // Теперь зависимость от currentIndex

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleTranslateClick = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setIsFlipped(!isFlipped);
    onWordStudied(); // Уведомляем родительский компонент об изучении слова
  };

  return (
    <div className={styles['react-card-flip']}>
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      {/* Front side */}
      <div className={styles['card-front']} onClick={handleClick}>
        <div className={styles['counter']}>{studiedCount}/{totalWords}</div>
        <h2>{word}</h2>
        <p><em>{transcription}</em></p>
        <button 
          ref={translateButtonRef}
          onClick={handleTranslateClick}
          className={styles['check-translationBtn']}
        >
          Посмотреть перевод
        </button>
      </div>

      {/* Back side */}
      <div className={styles['card-back']} onClick={handleClick}>
        <div className={styles['counter']}>{studiedCount}/{totalWords}</div>
        <h2>{translation}</h2>
      </div>
    </ReactCardFlip>
    </div>
    );
}

export default WordCard;