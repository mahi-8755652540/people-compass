import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const employeeSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(7, "Phone must be at least 7 digits").max(20),
  role: z.string().trim().min(2, "Role is required").max(100),
  department: z.string().min(1, "Department is required"),
  location: z.string().trim().min(2, "City is required").max(100),
  // Address fields
  streetAddress: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(10).optional(),
  // Bank details
  bankName: z.string().trim().max(100).optional(),
  accountNumber: z.string().trim().max(20).optional(),
  ifscCode: z.string().trim().max(15).optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: "active" | "away" | "offline";
  avatar: string;
  joinDate: string;
  phone: string;
  photo?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (employee: Employee) => void;
  departments: string[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const AddEmployeeDialog = ({
  open,
  onOpenChange,
  onAdd,
  departments,
}: AddEmployeeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      location: "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newEmployee: Employee = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      department: data.department,
      location: data.location,
      status: "active",
      avatar: getInitials(data.name),
      joinDate: formatDate(),
      photo: photo || undefined,
      address: data.streetAddress || data.city || data.state || data.pincode
        ? {
            street: data.streetAddress || "",
            city: data.city || "",
            state: data.state || "",
            pincode: data.pincode || "",
          }
        : undefined,
      bankDetails: data.bankName || data.accountNumber || data.ifscCode
        ? {
            bankName: data.bankName || "",
            accountNumber: data.accountNumber || "",
            ifscCode: data.ifscCode || "",
          }
        : undefined,
    };

    onAdd(newEmployee);
    toast.success(`${data.name} has been added successfully!`);
    reset();
    setPhoto(null);
    onOpenChange(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    setPhoto(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[60vh] pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="bank">Bank Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {photo ? (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden">
                        <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors border-2 border-dashed border-border"
                      >
                        <Camera className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Employee Photo</p>
                    <p className="text-xs text-muted-foreground">Upload a photo (max 5MB)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Rahul Sharma"
                      {...register("name")}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul@company.com"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      {...register("phone")}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Job Title *</Label>
                    <Input
                      id="role"
                      placeholder="Software Engineer"
                      {...register("role")}
                      aria-invalid={!!errors.role}
                    />
                    {errors.role && (
                      <p className="text-xs text-destructive">{errors.role.message}</p>
                    )}
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select onValueChange={(val) => setValue("department", val)}>
                      <SelectTrigger aria-invalid={!!errors.department}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-xs text-destructive">{errors.department.message}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Work Location *</Label>
                    <Input
                      id="location"
                      placeholder="Mumbai"
                      {...register("location")}
                      aria-invalid={!!errors.location}
                    />
                    {errors.location && (
                      <p className="text-xs text-destructive">{errors.location.message}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="space-y-4">
                  {/* Street Address */}
                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Textarea
                      id="streetAddress"
                      placeholder="123, ABC Colony, Near XYZ"
                      {...register("streetAddress")}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        {...register("city")}
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        {...register("state")}
                      />
                    </div>

                    {/* Pincode */}
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="400001"
                        {...register("pincode")}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="State Bank of India"
                      {...register("bankName")}
                    />
                  </div>

                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="1234567890"
                      {...register("accountNumber")}
                    />
                  </div>

                  {/* IFSC Code */}
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="SBIN0001234"
                      {...register("ifscCode")}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <DialogFooter className="pt-4 mt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
