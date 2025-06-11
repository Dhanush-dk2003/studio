
import type { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportPageLayoutProps {
  title: string;
  children: ReactNode;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ReportPageLayout({ 
  title, 
  children, 
  onExportPDF, 
  onExportExcel 
}: ReportPageLayoutProps) {
  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
    if (onExportPDF) onExportPDF();
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
    if (onExportExcel) onExportExcel();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">{title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
