import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Building2 } from "lucide-react";
import { toast } from "sonner";

interface SalarySlipData {
  employeeName: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  bankName?: string;
  accountNumber?: string;
  month: string;
  year: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
}

interface SalarySlipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SalarySlipData | null;
}

export const SalarySlipDialog = ({ open, onOpenChange, data }: SalarySlipDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const totalEarnings = data.basicSalary + data.hra + data.conveyance + data.medicalAllowance + data.specialAllowance;
  const totalDeductions = data.pf + data.esi + data.professionalTax + data.tds + data.otherDeductions;
  const netPay = totalEarnings - totalDeductions;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow pop-ups to print the salary slip");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Slip - ${data.employeeName} - ${data.month} ${data.year}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1a1a1a; }
            .container { max-width: 800px; margin: 0 auto; border: 2px solid #e5e5e5; padding: 30px; }
            .header { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #f59e0b; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e3a5f; margin-bottom: 5px; }
            .company-address { font-size: 12px; color: #666; }
            .slip-title { font-size: 18px; font-weight: bold; margin-top: 15px; color: #f59e0b; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 14px; font-weight: bold; color: #1e3a5f; margin-bottom: 10px; padding: 5px 10px; background: #f5f5f5; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 10px; }
            .info-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #e5e5e5; }
            .info-label { color: #666; font-size: 13px; }
            .info-value { font-weight: 500; font-size: 13px; }
            .salary-table { width: 100%; border-collapse: collapse; }
            .salary-table th, .salary-table td { padding: 10px; text-align: left; border: 1px solid #e5e5e5; font-size: 13px; }
            .salary-table th { background: #f5f5f5; font-weight: 600; }
            .amount { text-align: right !important; }
            .total-row { background: #fef3c7 !important; font-weight: bold; }
            .net-pay { background: #1e3a5f !important; color: white !important; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; }
            .signature { text-align: center; }
            .signature-line { width: 150px; border-top: 1px solid #333; margin-top: 50px; padding-top: 5px; font-size: 12px; }
            .note { margin-top: 20px; font-size: 11px; color: #666; text-align: center; }
            @media print { body { padding: 0; } .container { border: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-name">SSS Core Solutions Pvt. Ltd.</div>
              <div class="company-address">123 Business Park, Mumbai, Maharashtra - 400001</div>
              <div class="company-address">Tel: +91 22 1234 5678 | Email: hr@ssscore.com</div>
              <div class="slip-title">SALARY SLIP FOR ${data.month.toUpperCase()} ${data.year}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Employee Details</div>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Employee Name</span><span class="info-value">${data.employeeName}</span></div>
                <div class="info-item"><span class="info-label">Employee ID</span><span class="info-value">${data.employeeId}</span></div>
                <div class="info-item"><span class="info-label">Department</span><span class="info-value">${data.department}</span></div>
                <div class="info-item"><span class="info-label">Designation</span><span class="info-value">${data.designation}</span></div>
                <div class="info-item"><span class="info-label">Bank Name</span><span class="info-value">${data.bankName || 'N/A'}</span></div>
                <div class="info-item"><span class="info-label">Account No.</span><span class="info-value">${data.accountNumber ? '****' + data.accountNumber.slice(-4) : 'N/A'}</span></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Attendance Summary</div>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Working Days</span><span class="info-value">${data.workingDays}</span></div>
                <div class="info-item"><span class="info-label">Present Days</span><span class="info-value">${data.presentDays}</span></div>
                <div class="info-item"><span class="info-label">Leave Days</span><span class="info-value">${data.leaveDays}</span></div>
                <div class="info-item"><span class="info-label">Loss of Pay Days</span><span class="info-value">${data.workingDays - data.presentDays - data.leaveDays}</span></div>
              </div>
            </div>

            <table class="salary-table">
              <tr>
                <th colspan="2">Earnings</th>
                <th colspan="2">Deductions</th>
              </tr>
              <tr>
                <td>Basic Salary</td>
                <td class="amount">₹${data.basicSalary.toLocaleString('en-IN')}</td>
                <td>Provident Fund (PF)</td>
                <td class="amount">₹${data.pf.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>House Rent Allowance (HRA)</td>
                <td class="amount">₹${data.hra.toLocaleString('en-IN')}</td>
                <td>ESI</td>
                <td class="amount">₹${data.esi.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Conveyance Allowance</td>
                <td class="amount">₹${data.conveyance.toLocaleString('en-IN')}</td>
                <td>Professional Tax</td>
                <td class="amount">₹${data.professionalTax.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Medical Allowance</td>
                <td class="amount">₹${data.medicalAllowance.toLocaleString('en-IN')}</td>
                <td>TDS</td>
                <td class="amount">₹${data.tds.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Special Allowance</td>
                <td class="amount">₹${data.specialAllowance.toLocaleString('en-IN')}</td>
                <td>Other Deductions</td>
                <td class="amount">₹${data.otherDeductions.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total Earnings</strong></td>
                <td class="amount"><strong>₹${totalEarnings.toLocaleString('en-IN')}</strong></td>
                <td><strong>Total Deductions</strong></td>
                <td class="amount"><strong>₹${totalDeductions.toLocaleString('en-IN')}</strong></td>
              </tr>
              <tr class="net-pay">
                <td colspan="3"><strong>Net Pay</strong></td>
                <td class="amount"><strong>₹${netPay.toLocaleString('en-IN')}</strong></td>
              </tr>
            </table>

            <div class="footer">
              <div class="signature">
                <div class="signature-line">Employee Signature</div>
              </div>
              <div class="signature">
                <div class="signature-line">HR Manager</div>
              </div>
              <div class="signature">
                <div class="signature-line">Accounts</div>
              </div>
            </div>

            <div class="note">
              This is a computer-generated salary slip and does not require a physical signature.<br/>
              For any queries, please contact HR at hr@ssscore.com
            </div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Salary slip opened for printing/download");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Salary Slip - {data.month} {data.year}
          </DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="space-y-6">
          {/* Company Header */}
          <div className="text-center pb-4 border-b-2 border-primary">
            <h2 className="text-xl font-bold text-primary">SSS Core Solutions Pvt. Ltd.</h2>
            <p className="text-sm text-muted-foreground">123 Business Park, Mumbai, Maharashtra - 400001</p>
            <div className="mt-2 inline-block px-4 py-1 bg-primary/10 rounded-full">
              <span className="font-semibold text-primary">Salary Slip for {data.month} {data.year}</span>
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee Name</span>
                <span className="font-medium">{data.employeeName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-medium">{data.employeeId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{data.department}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Designation</span>
                <span className="font-medium">{data.designation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-medium">{data.bankName || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account No.</span>
                <span className="font-medium">{data.accountNumber ? '****' + data.accountNumber.slice(-4) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{data.workingDays}</p>
              <p className="text-xs text-muted-foreground">Working Days</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-success">{data.presentDays}</p>
              <p className="text-xs text-muted-foreground">Present Days</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-warning">{data.leaveDays}</p>
              <p className="text-xs text-muted-foreground">Leave Days</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg text-center">
              <p className="text-2xl font-bold text-destructive">{data.workingDays - data.presentDays - data.leaveDays}</p>
              <p className="text-xs text-muted-foreground">LOP Days</p>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-success/10 px-4 py-2 border-b">
                <h4 className="font-semibold text-success">Earnings</h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Basic Salary</span>
                  <span className="font-medium">₹{data.basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>HRA</span>
                  <span className="font-medium">₹{data.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conveyance</span>
                  <span className="font-medium">₹{data.conveyance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Medical Allowance</span>
                  <span className="font-medium">₹{data.medicalAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Special Allowance</span>
                  <span className="font-medium">₹{data.specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-success">
                  <span>Total Earnings</span>
                  <span>₹{totalEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-destructive/10 px-4 py-2 border-b">
                <h4 className="font-semibold text-destructive">Deductions</h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Provident Fund (PF)</span>
                  <span className="font-medium">₹{data.pf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ESI</span>
                  <span className="font-medium">₹{data.esi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Professional Tax</span>
                  <span className="font-medium">₹{data.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TDS</span>
                  <span className="font-medium">₹{data.tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Other Deductions</span>
                  <span className="font-medium">₹{data.otherDeductions.toLocaleString('en-IN')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-destructive">
                  <span>Total Deductions</span>
                  <span>₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="p-4 bg-primary rounded-lg text-primary-foreground">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Net Pay</span>
              <span className="text-3xl font-bold">₹{netPay.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-sm opacity-80 mt-1">
              Amount in words: {numberToWords(netPay)} Rupees Only
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Download className="w-4 h-4" />
            Download / Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to convert number to words
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + ones[n % 10] + ' ';
    return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanThousand(n % 100);
  }

  let result = '';
  
  if (num >= 10000000) {
    result += convertLessThanThousand(Math.floor(num / 10000000)) + 'Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    result += convertLessThanThousand(Math.floor(num / 100000)) + 'Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    result += convertLessThanThousand(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  result += convertLessThanThousand(num);

  return result.trim();
}
