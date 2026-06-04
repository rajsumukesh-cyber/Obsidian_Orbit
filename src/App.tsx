/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="pl-64 pt-16 p-xl">
        <Dashboard searchQuery={searchQuery} />
      </main>
    </div>
  );
}
