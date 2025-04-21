import React, { useState, useEffect } from 'react';
import './App.css';
import Movie from './components/Movies/Movie';
import { Tabs } from 'antd';
import RatedMovie from './components/Rated/Rated';

function App() {
  const [activeKey, setActiveKey] = useState('search');
  const [sessionId, getSessionId] = useState(null)

  const createGuestSession = () => {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=514672082404a98e787157e73017cdb5')
      .then((res) => res.json())
      .then((json) => {
        getSessionId(json.guest_session_id)
      })
  }

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const items = [
    {
      key: 'search',
      label: 'Search',
      children: <Movie sessionId={sessionId} />,
    },
    {
      key: 'rated',
      label: 'Rated',
      children: <RatedMovie sessionId={sessionId} />,
    }
  ]

  useEffect(() => {
    createGuestSession();
  }, [])

  return (
    <div className="App">
      <div className="wrapper">
        <Tabs
          defaultActiveKey="search"
          centered
          items={items}
          size="large"
          onChange={handleTabChange}
        />
      </div>
    </div>
  );
}

export default App;
