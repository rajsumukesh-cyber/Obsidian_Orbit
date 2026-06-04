import { LayoutDashboard, Mic, Sparkles, FolderArchive, HelpCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/10 flex flex-col pt-20 z-40">
      <div className="px-md mb-xl">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">DeepSpace</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant">Meeting Intelligence</p>
      </div>
      <div className="flex-1 px-sm space-y-xs">
        {[
          { name: 'Dashboard', icon: LayoutDashboard },
          { name: 'Live Record', icon: Mic },
          { name: 'Insights', icon: Sparkles },
          { name: 'Archive', icon: FolderArchive },
        ].map((item) => (
          <a key={item.name} href="#" className="flex items-center gap-xs px-md py-sm rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-all">
            <item.icon size={20} />
            <span className="font-label-caps text-label-caps uppercase">{item.name}</span>
          </a>
        ))}
      </div>
      <div className="px-md mb-lg">
        <button onClick={() => console.log('Start recording')} className="w-full bg-primary text-on-primary py-sm rounded-xl font-title-md text-sm shadow-lg flex items-center justify-center gap-xs">
          <Mic size={18} />
          Record Now
        </button>
      </div>
    </nav>
  );
}
