import { Search, Bell, Settings } from 'lucide-react';

export default function TopBar({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (s: string) => void }) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-surface/70 backdrop-blur-xl border-b border-white/10 z-50 flex justify-between items-center px-md lg:px-xl pl-72">
      <div className="text-primary font-bold text-xl">Obsidian Orbit</div>
      <div className="flex items-center gap-md">
        <div className="hidden md:flex bg-surface-container-lowest border border-outline-variant px-md py-xs rounded-xl items-center gap-sm">
          <Search size={18} className="text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search insights..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-body-sm w-48 text-on-surface focus:outline-none" 
          />
        </div>
        <Bell size={20} className="text-on-surface-variant" />
        <Settings size={20} className="text-on-surface-variant" />
        <div className="w-8 h-8 rounded-full bg-surface-bright" />
      </div>
    </header>
  );
}
