import React from 'react';
import { useParams } from 'react-router-dom';
import KnownUnknown from './KnownUnknown';

function TopicPage() {
  const { topicName } = useParams();

  return (
    <div className="topic-container">
      <h2 style={{textAlign:'center'}}>Текущая тема: {topicName}</h2>
      <KnownUnknown />
    </div>
  );
}

export default TopicPage;