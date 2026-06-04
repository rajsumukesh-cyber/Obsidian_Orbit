import { Mic, Sparkles, Clock, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import EngagementChart from './EngagementChart';
import { Meeting } from '../types';
import MeetingCard from './MeetingCard';

const DEFAULT_MEETINGS: Meeting[] = [
  { id: '1', title: "Q3 Roadmap Planning", date: '2023-10-14', duration: '45m', status: 'Ready', attendees: [], actionItems: [], category: 'Internal', summary: 'Discussion on Q3 goals and milestones.', priority: 'High', transcript: [{ timestamp: '00:00', text: 'Okay, let\'s start.' }, { timestamp: '00:15', text: 'We need to define Q3 goals.' }], notes: '', tags: [] },
  { id: '2', title: "Design Review: Obsidian UI", date: '2026-05-30', duration: 'Live', status: 'Processing', attendees: [], actionItems: [], category: 'Client', summary: 'Reviewing UI mockups for Obsidian project.', priority: 'Medium', transcript: [{ timestamp: '00:00', text: 'This looks good.' }, { timestamp: '00:30', text: 'Can we change the button color?' }], notes: '', tags: [] },
  { id: '3', title: "Investor Sync: Seed Round", date: '2023-10-13', duration: '1h 12m', status: 'Ready', attendees: [], actionItems: [], category: 'Investor', summary: 'Seed round follow-up with key investors.', priority: 'High', transcript: [{ timestamp: '00:00', text: 'Thanks for coming.' }, { timestamp: '00:10', text: 'The seed round is progressing.' }], notes: '', tags: [] },
];

export default function Dashboard({ searchQuery }: { searchQuery: string }) {
  const [meetings, setMeetings] = useState<Meeting[]>(DEFAULT_MEETINGS);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [category, setCategory] = useState<'All' | 'Internal' | 'Client' | 'Investor'>('All');
  const [attendeeFilter, setAttendeeFilter] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        console.log('Recording stopped. Blob created:', blob);
        // Here you would upload the audio file to the backend
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSaveNotes = (id: string, notes: string) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, notes } : m));
  };

  const handleAddTag = (id: string, tag: string) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, tags: [...m.tags, tag] } : m));
  };

  const sortedMeetings = useMemo(() => {
    let filteredMeetings = meetings.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === 'All' || m.category === category) &&
      (attendeeFilter === '' || m.attendees.some(a => a.toLowerCase().includes(attendeeFilter.toLowerCase())))
    );
    return filteredMeetings.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [sort, searchQuery, category, attendeeFilter, meetings]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Hero Header */}
      <section className="col-span-12 mb-8">
        <h1 className="text-display-lg font-bold text-on-surface mb-2">Welcome, Commander</h1>
        <p className="text-body-lg text-on-surface-variant">System status: All intelligence nodes operational. 4 meetings analyzed today.</p>
      </section>

      {/* Weekly Insights Summary (Bento Large) */}
      <motion.section 
        className="col-span-12 lg:col-span-8 bg-surface-container border border-white/5 p-8 rounded-3xl relative overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-primary" />
          <h3 className="text-title-md font-semibold text-on-surface">Weekly Insights Summary</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <p className="text-ai-insight text-on-surface mb-10 leading-relaxed">
              "Your team's collaboration focus has shifted towards <span className="text-primary font-bold">Architecture Scalability</span> this week..."
            </p>
            <div className="grid grid-cols-3 gap-6">
              <InsightStat label="Key Theme" value="Microservices" />
              <InsightStat label="Efficiency" value="+12.4%" />
              <InsightStat label="Action Items" value="8 Pending" />
            </div>
          </div>
          <EngagementChart />
        </div>
      </motion.section>

      {/* Record Now (Bento Small) */}
      <section className="col-span-12 lg:col-span-4 bg-surface-container border border-white/5 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-title-md font-semibold text-on-surface mb-2">Initiate Capture</h3>
          <p className="text-body-sm text-on-surface-variant">Start a new encrypted recording session.</p>
        </div>
        <button onClick={isRecording ? stopRecording : startRecording} className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all ${isRecording ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>
          <Mic size={20} />
          {isRecording ? 'Stop Recording' : 'Record Now'}
        </button>
      </section>

      {/* Recent Meetings */}
      <section className="col-span-12 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-headline-lg font-semibold">Recent Meetings</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Filter by attendee..."
              value={attendeeFilter}
              onChange={(e) => setAttendeeFilter(e.target.value)}
              className="bg-surface-container text-on-surface border border-white/5 p-2 rounded-lg text-sm focus:outline-none"
            />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-surface-container text-on-surface border border-white/5 p-2 rounded-lg text-sm focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Internal">Internal</option>
              <option value="Client">Client</option>
              <option value="Investor">Investor</option>
            </select>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value as any)}
              className="bg-surface-container text-on-surface border border-white/5 p-2 rounded-lg text-sm focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {sortedMeetings.map(m => (
             <MeetingCard 
              key={m.id} 
              id={m.id}
              title={m.title} 
              time={`${m.date} • ${m.duration}`} 
              status={m.status} 
              attendees={m.attendees} 
              actionItems={m.actionItems}
              category={m.category}
              summary={m.summary}
              priority={m.priority}
              transcript={m.transcript}
              notes={m.notes}
              tags={m.tags}
              onSaveNotes={handleSaveNotes}
              onAddTag={handleAddTag}
              searchQuery={searchQuery}
             />
           ))}
        </div>
      </section>
    </div>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-inner">
      <span className="text-label-caps text-on-surface-variant block mb-2 uppercase text-xs">{label}</span>
      <span className="text-title-md text-primary font-bold">{value}</span>
    </div>
  );
}
