import { Mail, Phone, MapPin, Building2, Calendar, CreditCard, Landmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Employee } from "@/context/EmployeeContext";

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const statusStyles = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

const statusLabels = {
  active: "Active",
  away: "Away",
  offline: "Offline",
};

export const ViewEmployeeDialog = ({
  open,
  onOpenChange,
  employee,
}: ViewEmployeeDialogProps) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Employee Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with photo and basic info */}
          <div className="flex items-center gap-4">
            {employee.photo ? (
              <img
                src={employee.photo}
                alt={employee.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                {employee.avatar}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{employee.name}</h3>
              <p className="text-muted-foreground">{employee.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{employee.department}</Badge>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${statusStyles[employee.status]}`} />
                  <span className="text-xs text-muted-foreground">{statusLabels[employee.status]}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Contact Information</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{employee.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {employee.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          {employee.address && (employee.address.street || employee.address.city || employee.address.state || employee.address.pincode) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Residential Address</h4>
                <div className="flex items-start gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    {employee.address.street && <p>{employee.address.street}</p>}
                    <p>
                      {[employee.address.city, employee.address.state].filter(Boolean).join(", ")}
                      {employee.address.pincode && ` - ${employee.address.pincode}`}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bank Details */}
          {employee.bankDetails && (employee.bankDetails.bankName || employee.bankDetails.accountNumber || employee.bankDetails.ifscCode) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Bank Details</h4>
                <div className="grid gap-2">
                  {employee.bankDetails.bankName && (
                    <div className="flex items-center gap-3 text-sm">
                      <Landmark className="w-4 h-4 text-muted-foreground" />
                      <span>{employee.bankDetails.bankName}</span>
                    </div>
                  )}
                  {employee.bankDetails.accountNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span>A/C: {employee.bankDetails.accountNumber}</span>
                    </div>
                  )}
                  {employee.bankDetails.ifscCode && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-4 h-4 text-xs font-medium text-muted-foreground flex items-center justify-center">IF</span>
                      <span>IFSC: {employee.bankDetails.ifscCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
