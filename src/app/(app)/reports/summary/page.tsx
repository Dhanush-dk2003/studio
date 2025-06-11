
"use client";

import { useState, useEffect, FormEvent } from "react";
import ReportPageLayout from "@/components/reports/report-page-layout";
import FilterSection from "@/components/reports/filter-section";
import SummaryCard from "@/components/reports/summary-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BarChartHorizontalBig, CalendarDays, Languages, Merge, Waypoints, Loader2 } from "lucide-react";
import type { SummaryData } from "@/types";
import { useToast } from "@/hooks/use-toast";


interface GroupingOptions {
  byDate: boolean;
  byLanguage: boolean;
  byTransferVDN: boolean;
  byExitMenu: boolean;
}

const initialGroupingOptions: GroupingOptions = {
  byDate: true,
  byLanguage: false,
  byTransferVDN: false,
  byExitMenu: false,
};

// Mock summary data generation
const generateMockSummary = (grouping: GroupingOptions): SummaryData[] => {
  const summaries: SummaryData[] = [];
  if (grouping.byDate) {
    summaries.push(
      { group: "2024-07-15", totalCalls: 150, averageDuration: "3m 45s", answeredCalls: 120, missedCalls: 30 },
      { group: "2024-07-16", totalCalls: 180, averageDuration: "4m 02s", answeredCalls: 150, missedCalls: 30 }
    );
  }
  if (grouping.byLanguage) {
    summaries.push(
      { group: "English", totalCalls: 200, averageDuration: "3m 50s", answeredCalls: 180, missedCalls: 20 },
      { group: "Swahili", totalCalls: 130, averageDuration: "4m 10s", answeredCalls: 100, missedCalls: 30 }
    );
  }
  if (grouping.byTransferVDN) {
     summaries.push(
      { group: "VDN001", totalCalls: 80, averageDuration: "2m 30s", answeredCalls: 70, missedCalls: 10 },
      { group: "VDN002", totalCalls: 50, averageDuration: "5m 00s", answeredCalls: 45, missedCalls: 5 }
    );
  }
  if (grouping.byExitMenu) {
     summaries.push(
      { group: "Sales", totalCalls: 60, averageDuration: "3m 00s", answeredCalls: 55, missedCalls: 5 },
      { group: "Support", totalCalls: 70, averageDuration: "4m 30s", answeredCalls: 60, missedCalls: 10 }
    );
  }
  if (summaries.length === 0) { // Default if nothing selected
    summaries.push(
      { group: "Overall", totalCalls: 330, averageDuration: "3m 55s", answeredCalls: 270, missedCalls: 60 }
    );
  }
  return summaries;
};


export default function SummaryReportPage() {
  const [groupingOptions, setGroupingOptions] = useState<GroupingOptions>(initialGroupingOptions);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGroupingChange = (option: keyof GroupingOptions) => {
    setGroupingOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Generating summary with grouping:", groupingOptions);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const data = generateMockSummary(groupingOptions);
    setSummaryData(data);
    setIsLoading(false);
    toast({
      title: "Summary Report Generated",
      description: `Displaying ${data.length} summary groups.`,
    });
  };

  // Load initial summary
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simulate initial load
      setSummaryData(generateMockSummary(initialGroupingOptions));
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <ReportPageLayout title="Summary Report">
      <FilterSection title="Group By Options" icon={Merge}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {(Object.keys(initialGroupingOptions) as Array<keyof GroupingOptions>).map((key) => {
              let label = "";
              let Icon;
              switch (key) {
                case "byDate": label = "Date"; Icon = CalendarDays; break;
                case "byLanguage": label = "Language"; Icon = Languages; break;
                case "byTransferVDN": label = "Transfer VDN"; Icon = Waypoints; break;
                case "byExitMenu": label = "Exit Menu"; Icon = BarChartHorizontalBig; break;
              }
              return (
                <div key={key} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  {Icon && <Icon className="h-5 w-5 text-primary"/>}
                  <Checkbox
                    id={key}
                    checked={groupingOptions[key]}
                    onCheckedChange={() => handleGroupingChange(key)}
                  />
                  <Label htmlFor={key} className="font-medium cursor-pointer select-none">
                    {label}
                  </Label>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChartHorizontalBig className="mr-2 h-4 w-4" />}
              Generate Summary
            </Button>
          </div>
        </form>
      </FilterSection>

      {isLoading && summaryData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="ml-2">Loading summary data...</p>
        </div>
      ) : !isLoading && summaryData.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No summary data to display. Select grouping options and generate the report.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {summaryData.map((summary, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg bg-card">
              <h3 className="text-lg font-semibold text-primary">{summary.group}</h3>
              <SummaryCard title="Total Calls" value={summary.totalCalls} />
              <SummaryCard title="Avg. Duration" value={summary.averageDuration} />
              <SummaryCard title="Answered Calls" value={summary.answeredCalls} />
              <SummaryCard title="Missed Calls" value={summary.missedCalls} />
            </div>
          ))}
        </div>
      )}
    </ReportPageLayout>
  );
}
