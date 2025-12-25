import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const weekData = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 90, absent: 10 },
  { day: "Fri", present: 85, absent: 15 },
  { day: "Sat", present: 45, absent: 55 },
  { day: "Sun", present: 20, absent: 80 },
];

export const AttendanceChart = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, style, ...props }, ref) => {
    const avgAttendance = Math.round(
      weekData.reduce((acc, d) => acc + d.present, 0) / weekData.length
    );

    return (
      <div
        ref={ref}
        className={cn("bg-card rounded-2xl shadow-card p-6 animate-slide-up", className)}
        style={{ animationDelay: "250ms", ...style }}
        {...props}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Weekly Attendance
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">Last 7 days overview</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-foreground">{avgAttendance}%</p>
            <p className="text-xs text-muted-foreground">Avg. attendance</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end justify-between gap-2 h-40 mb-4">
          {weekData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col gap-0.5 h-32">
                <div
                  className="w-full bg-muted/50 rounded-t-md transition-all duration-500"
                  style={{ 
                    height: `${data.absent}%`,
                    animationDelay: `${index * 50}ms` 
                  }}
                />
                <div
                  className="w-full gradient-primary rounded-b-md transition-all duration-500"
                  style={{ 
                    height: `${data.present}%`,
                    animationDelay: `${index * 50}ms` 
                  }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full gradient-primary" />
            <span className="text-sm text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>
        </div>
      </div>
    );
  }
);

AttendanceChart.displayName = "AttendanceChart";
