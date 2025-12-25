import { TrendingUp } from "lucide-react";

const weekData = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 90, absent: 10 },
  { day: "Fri", present: 85, absent: 15 },
];

export const AttendanceChart = () => {
  const maxValue = 100;

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "250ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Weekly Attendance</h3>
          <p className="text-sm text-muted-foreground">This week's attendance overview</p>
        </div>
        <div className="flex items-center gap-2 text-success">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">90% avg</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 h-40">
        {weekData.map((data, index) => (
          <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full rounded-t-lg gradient-primary transition-all duration-500 hover:opacity-90"
              style={{ 
                height: `${(data.present / maxValue) * 100}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
            <span className="text-xs font-medium text-muted-foreground">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full gradient-primary" />
          <span className="text-sm text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-muted" />
          <span className="text-sm text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
};
