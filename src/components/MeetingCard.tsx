import { motion } from 'motion/react';
import { Clock, Share2, Download, Copy, CheckCircle2, Loader2, FileAudio } from 'lucide-react';
import React from 'react';
import jsPDF from 'jspdf';

interface MeetingCardProps {
  id: string;
  title: string;
  time: string;
  status: 'Ready' | 'Processing';
  attendees: string[];
  actionItems: { text: string; completed: boolean; }[];
  category: 'Internal' | 'Client' | 'Investor';
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
  transcript: { timestamp: string; text: string; }[];
  notes?: string;
  tags: string[];
  onSaveNotes: (id: string, notes: string) => void;
  onAddTag: (id: string, tag: string) => void;
  searchQuery?: string;
}

const HighlightedText = ({ text, query }: { text: string; query?: string }) => {
  if (!query || query.trim() === '') return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-black">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const MeetingCard: React.FC<MeetingCardProps> = ({ id, title, time, status, attendees, actionItems, category, summary, priority, transcript, notes = '', tags = [], onSaveNotes, onAddTag, searchQuery }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [localNotes, setLocalNotes] = React.useState(notes);
  const [localTags, setLocalTags] = React.useState(tags);
  const [newTag, setNewTag] = React.useState('');
  const [localActionItems, setLocalActionItems] = React.useState(actionItems);

  const toggleActionItem = (index: number) => {
    setLocalActionItems(prev => prev.map((item, i) => i === index ? { ...item, completed: !item.completed } : item));
  };

  const sortActionItems = () => {
    setLocalActionItems(prev => [...prev].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)));
  };
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [localAttendees, setLocalAttendees] = React.useState(attendees);
  const [newAttendee, setNewAttendee] = React.useState('');

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Meeting Report: ${title}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Title: ${title}`, 20, 35);
    doc.text(`Date: ${time}`, 20, 45);
    doc.text(`Category: ${category}`, 20, 55);
    doc.text(`Priority: ${priority}`, 20, 65);
    
    doc.text("Summary:", 20, 80);
    doc.text(summary, 20, 90, { maxWidth: 170 });
    
    doc.text("Action Items:", 20, 110);
    localActionItems.forEach((item, index) => {
      doc.text(`- ${item.text} [${item.completed ? 'Completed' : 'Pending'}]`, 20, 120 + (index * 10));
    });
    
    doc.text("Transcription:", 20, 150 + (localActionItems.length * 10));
    transcript.slice(0, 10).forEach((line, index) => {
      doc.text(`[${line.timestamp}] ${line.text}`, 20, 160 + (localActionItems.length * 10) + (index * 10));
    });

    doc.save(`${title.replace(/\s+/g, '_')}_report.pdf`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const downloadAudio = () => {
    const element = document.createElement("a");
    const file = new Blob(["mock audio content"], { type: 'audio/mpeg' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}.mp3`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateActionItems = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      setLocalActionItems(data.actionItems.map((text: string) => ({ text, completed: false })));
    } catch (error) {
      console.error('Failed to generate action items:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNotes = () => {
    onSaveNotes(id, localNotes);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(id, newTag.trim());
      setLocalTags([...localTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleAddAttendee = () => {
    if (newAttendee.trim()) {
      setLocalAttendees([...localAttendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -5, borderColor: 'rgba(208, 188, 255, 0.5)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}
      animate={status === 'Processing' ? {
        boxShadow: [
          '0 0 5px rgba(139, 92, 246, 0.1)',
          '0 0 15px rgba(139, 92, 246, 0.3)',
          '0 0 5px rgba(139, 92, 246, 0.1)'
        ]
      } : {}}
      transition={status === 'Processing' ? { repeat: Infinity, duration: 2 } : {}}
      className="bg-surface-container border border-white/5 p-8 rounded-3xl hover:border-primary/30 shadow-sm transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center text-xs font-semibold text-primary">
          {category.charAt(0)}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-label-caps text-xs px-3 py-1 rounded-full ${
              priority === 'High' ? 'bg-red-500/10 text-red-600' : 
              priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-green-500/10 text-green-600'
            }`}>{priority}</span>
            <span className="text-label-caps text-xs px-3 py-1 bg-primary/10 rounded-full text-primary">{category}</span>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Share2 size={18} />
            </button>
            <button onClick={copyLink} className="text-on-surface-variant hover:text-primary transition-colors">
              <Copy size={18} />
            </button>
            <button onClick={downloadAudio} className="text-on-surface-variant hover:text-primary transition-colors">
              <FileAudio size={18} />
            </button>
            <button onClick={exportToPDF} className="text-on-surface-variant hover:text-primary transition-colors">
              <Download size={18} />
            </button>
            <span className="flex items-center justify-center p-1.5 bg-surface-container-highest rounded-full text-on-surface-variant">
              {status === 'Ready' ? <CheckCircle2 size={16} className="text-secondary" /> : <Loader2 size={16} className="text-primary animate-spin" />}
            </span>
          </div>
          {status === 'Processing' && (
            <div className="w-24 h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '70%' }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          )}
        </div>
      </div>
      <h4 className="text-title-md font-semibold mb-2">
        <HighlightedText text={title} query={searchQuery} />
      </h4>
      <p className={`text-body-sm text-on-surface-variant mb-4 ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}>
        <HighlightedText text={summary} query={searchQuery} />
      </p>
      <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
        <Clock size={16} />
        {time}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-primary underline"
      >
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="mt-4 text-sm text-on-surface-variant">
          <div className="mb-4">
            <p className="font-semibold text-on-surface mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {localTags.map(tag => (
                <span key={tag} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow bg-surface-container-low p-2 rounded-lg text-sm text-on-surface border border-outline-variant focus:border-primary"
                placeholder="Add tag..."
              />
              <button onClick={handleAddTag} className="bg-primary text-on-primary px-3 py-2 rounded-lg text-sm hover:opacity-90">Add</button>
            </div>
          </div>
          <p className="font-semibold text-on-surface mb-2">Attendees:</p>
          <div className="flex -space-x-2 mb-4">
            {localAttendees.map(a => (
              <div key={a} className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-semibold border-2 border-surface-container">
                {a.charAt(0)}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input
              value={newAttendee}
              onChange={(e) => setNewAttendee(e.target.value)}
              className="flex-grow bg-surface-container-low p-2 rounded-lg text-sm text-on-surface border border-outline-variant focus:border-primary"
              placeholder="Add attendee name..."
            />
            <button onClick={handleAddAttendee} className="bg-primary text-on-primary px-3 py-2 rounded-lg text-sm hover:opacity-90">Add</button>
          </div>
          <p className="font-semibold text-on-surface">Action Items:</p>
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={generateActionItems}
              className="text-xs bg-primary text-on-primary px-3 py-1 rounded-full flex items-center gap-1 hover:opacity-90"
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : null}
              Generate Action Items
            </button>
            <button 
              onClick={sortActionItems}
              className="text-xs bg-surface-container-highest text-on-surface px-3 py-1 rounded-full flex items-center gap-1 hover:bg-surface-container-highest/80"
            >
              Sort by Status
            </button>
          </div>
          {localActionItems.map((a, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <input type="checkbox" checked={a.completed} onChange={() => toggleActionItem(index)} />
              <li className={a.completed ? 'line-through text-gray-500' : ''}>{a.text}</li>
            </div>
          ))}
          <p className="font-semibold text-on-surface">Quick Notes:</p>
          <textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            className="w-full bg-surface-container-low p-2 rounded-lg text-sm text-on-surface border border-outline-variant focus:border-primary resize-none mt-2"
            placeholder="Add personal notes here..."
            rows={3}
          />
          <button 
            onClick={handleSaveNotes}
            className="mt-2 bg-primary text-on-primary px-3 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Save Notes
          </button>
          <p className="font-semibold text-on-surface mt-4">Transcript Preview:</p>
          <div className="bg-surface-container-low p-3 rounded-lg text-xs h-32 overflow-y-auto mt-2 border border-outline-variant">
            {transcript.map((line, i) => (
              <div key={i} className="mb-2">
                <span className="text-primary font-mono font-bold mr-2">[{line.timestamp}]</span>
                <span className="text-on-surface">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeetingCard;
