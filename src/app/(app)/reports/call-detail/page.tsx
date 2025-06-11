
"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import ReportPageLayout from "@/components/reports/report-page-layout";
import FilterSection from "@/components/reports/filter-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, Filter, Languages, Hash, Smartphone, ListChecks, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { CallDetailRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";

const initialDateRange: DateRange = {
  from: addDays(new Date(), -7),
  to: new Date(),
};

// Mock Data
const mockCallDetailData: CallDetailRecord[] = Array.from({ length: 25 }, (_, i) => ({
  id: (i + 1).toString(),
  date: format(addDays(new Date(), -Math.floor(i / 3)), "yyyy-MM-dd"),
  time: `${String(10 + Math.floor(i/2) % 12).padStart(2, '0')}:${String(i*15 % 60).padStart(2, '0')}:00`,
  language: i % 3 === 0 ? "English" : i % 3 === 1 ? "Swahili" : "French",
  clid: `CLID${1000 + i}`,
  nssfNumber: `NSSF${500 + i}`,
  nssfMobile: `07${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
  duration: `${Math.floor(Math.random() * 10) + 1}m ${Math.floor(Math.random() * 60)}s`,
  callType: i % 2 === 0 ? "Inbound" : "Outbound",
  status: i % 4 === 0 ? "Answered" : i % 4 === 1 ? "Missed" : "Voicemail",
  agentName: i % 5 === 0 ? `Agent ${String.fromCharCode(65 + i % 10)}` : undefined,
  transferVDN: i % 6 === 0 ? `VDN${200+i}` : undefined,
  exitMenu: i % 7 === 0 ? `Option ${i%3+1}` : undefined,
}));


export default function CallDetailReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [language, setLanguage] = useState<string>(""); // Default to "" for placeholder
  const [clid, setClid] = useState<string>("");
  const [nssfNumber, setNssfNumber] = useState<string>("");
  const [nssfMobile, setNssfMobile] = useState<string>("");

  const [reportData, setReportData] = useState<CallDetailRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Filtering with:", { dateRange, language, clid, nssfNumber, nssfMobile });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock filtering logic
    const filteredData = mockCallDetailData.filter(record => {
        let match = true;
        if (dateRange?.from && new Date(record.date) < dateRange.from) match = false;
        if (dateRange?.to && new Date(record.date) > dateRange.to) match = false;
        if (language && language !== "all" && record.language !== language) match = false;
        if (clid && !record.clid.includes(clid)) match = false;
        if (nssfNumber && !record.nssfNumber.includes(nssfNumber)) match = false;
        if (nssfMobile && !record.nssfMobile.includes(nssfMobile)) match = false;
        return match;
    });

    setReportData(filteredData);
    setIsLoading(false);
    toast({
      title: "Report Generated",
      description: `Found ${filteredData.length} records.`,
    });
  };

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simulate initial load
      setReportData(mockCallDetailData.slice(0, 10)); // Show first 10 initially
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <ReportPageLayout title="Call Detail Report">
      <FilterSection title="Filter Criteria" icon={Filter}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="date-range" className="mb-2 block">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="language" className="mb-2 block">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="clid" className="mb-2 block">CLID</Label>
              <Input id="clid" placeholder="Enter CLID" value={clid} onChange={(e: ChangeEvent<HTMLInputElement>) => setClid(e.target.value)} />
            </div>
            
            <div>
              <Label htmlFor="nssfNumber" className="mb-2 block">NSSF Number</Label>
              <Input id="nssfNumber" placeholder="Enter NSSF Number" value={nssfNumber} onChange={(e: ChangeEvent<HTMLInputElement>) => setNssfNumber(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="nssfMobile" className="mb-2 block">NSSF Mobile Number</Label>
              <Input id="nssfMobile" placeholder="Enter NSSF Mobile" value={nssfMobile} onChange={(e: ChangeEvent<HTMLInputElement>) => setNssfMobile(e.target.value)} />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
              Generate Report
            </Button>
          </div>
        </form>
      </FilterSection>

      {isLoading && reportData.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading report data...</p>
        </div>
      ) : !isLoading && reportData.length === 0 ? (
         <Card className="mt-6">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No records found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>CLID</TableHead>
                  <TableHead>NSSF No.</TableHead>
                  <TableHead>NSSF Mobile</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>{record.language}</TableCell>
                    <TableCell>{record.clid}</TableCell>
                    <TableCell>{record.nssfNumber}</TableCell>
                    <TableCell>{record.nssfMobile}</TableCell>
                    <TableCell>{record.duration}</TableCell>
                    <TableCell>{record.callType}</TableCell>
                    <TableCell>{record.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </ReportPageLayout>
  );
}

