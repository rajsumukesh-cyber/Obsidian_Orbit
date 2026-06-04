import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface EngagementData {
  day: string;
  engagement: number;
}

export default function EngagementChart() {
  const [data, setData] = useState<EngagementData[]>([]);

  useEffect(() => {
    fetch('/api/meetings/engagement')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="h-64 w-full bg-surface-container/50 border border-white/5 p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#494454" />
          <XAxis dataKey="day" stroke="#958ea0" />
          <YAxis stroke="#958ea0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#131314', border: '1px solid #494454' }}
            itemStyle={{ color: '#d0bcff' }}
          />
          <Line type="monotone" dataKey="engagement" stroke="#d0bcff" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
