import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Lobby } from './pages/Lobby';
import { GameBoard } from './pages/GameBoard';
import { Results } from './pages/Results';
import { DevBoard } from './pages/DevBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/dev" element={<DevBoard />} />
        <Route path="/game/:gameId" element={<GameBoard />} />
        <Route path="/results/:gameId" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
