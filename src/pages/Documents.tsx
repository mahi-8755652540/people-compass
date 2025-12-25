import { useState } from "react";
import {
  FileText,
  Folder,
  Upload,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Plus,
  FolderPlus,
  File,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentFile {
  id: number;
  name: string;
  type: "pdf" | "doc" | "xls" | "img" | "zip" | "other";
  size: string;
  category: string;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  shared: boolean;
}

interface FolderItem {
  id: number;
  name: string;
  filesCount: number;
  color: string;
}

const initialFolders: FolderItem[] = [
  { id: 1, name: "HR Policies", filesCount: 12, color: "bg-primary" },
  { id: 2, name: "Employee Contracts", filesCount: 48, color: "bg-accent" },
  { id: 3, name: "Training Materials", filesCount: 24, color: "bg-success" },
  { id: 4, name: "Compliance", filesCount: 8, color: "bg-warning" },
  { id: 5, name: "Templates", filesCount: 15, color: "bg-destructive" },
];

const categories = ["All", "Policies", "Contracts", "Training", "Compliance", "Templates", "Reports"];

const initialDocuments: DocumentFile[] = [
  { id: 1, name: "Employee Handbook 2025.pdf", type: "pdf", size: "2.4 MB", category: "Policies", folder: "HR Policies", uploadedBy: "Sarah Johnson", uploadedAt: "Dec 20, 2025", shared: true },
  { id: 2, name: "Leave Policy.pdf", type: "pdf", size: "856 KB", category: "Policies", folder: "HR Policies", uploadedBy: "Sarah Johnson", uploadedAt: "Dec 18, 2025", shared: true },
  { id: 3, name: "Employment Contract Template.docx", type: "doc", size: "124 KB", category: "Templates", folder: "Templates", uploadedBy: "Michael Chen", uploadedAt: "Dec 15, 2025", shared: false },
  { id: 4, name: "Q4 Training Schedule.xlsx", type: "xls", size: "456 KB", category: "Training", folder: "Training Materials", uploadedBy: "Emma Wilson", uploadedAt: "Dec 12, 2025", shared: true },
  { id: 5, name: "Compliance Checklist 2025.pdf", type: "pdf", size: "1.2 MB", category: "Compliance", folder: "Compliance", uploadedBy: "David Kim", uploadedAt: "Dec 10, 2025", shared: false },
  { id: 6, name: "Onboarding Guide.pdf", type: "pdf", size: "3.8 MB", category: "Training", folder: "Training Materials", uploadedBy: "Sarah Johnson", uploadedAt: "Dec 8, 2025", shared: true },
  { id: 7, name: "Office Layout.png", type: "img", size: "2.1 MB", category: "Reports", folder: "HR Policies", uploadedBy: "James Rodriguez", uploadedAt: "Dec 5, 2025", shared: false },
  { id: 8, name: "Benefits Package Details.pdf", type: "pdf", size: "1.5 MB", category: "Policies", folder: "HR Policies", uploadedBy: "Sophia Turner", uploadedAt: "Dec 3, 2025", shared: true },
  { id: 9, name: "Performance Review Template.docx", type: "doc", size: "98 KB", category: "Templates", folder: "Templates", uploadedBy: "Emma Wilson", uploadedAt: "Dec 1, 2025", shared: true },
  { id: 10, name: "Tax Documents 2025.zip", type: "zip", size: "15.2 MB", category: "Compliance", folder: "Compliance", uploadedBy: "David Kim", uploadedAt: "Nov 28, 2025", shared: false },
];

const fileTypeIcons = {
  pdf: FileText,
  doc: File,
  xls: FileSpreadsheet,
  img: FileImage,
  zip: FileArchive,
  other: File,
};

const fileTypeColors = {
  pdf: "text-destructive",
  doc: "text-primary",
  xls: "text-success",
  img: "text-accent",
  zip: "text-warning",
  other: "text-muted-foreground",
};

const Documents = () => {
  const [documents, setDocuments] = useState<DocumentFile[]>(initialDocuments);
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadFolder, setUploadFolder] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size);
    const unit = doc.size.includes("MB") ? 1 : 0.001;
    return sum + size * unit;
  }, 0);

  const handleUpload = () => {
    const newDoc: DocumentFile = {
      id: Date.now(),
      name: "New Document.pdf",
      type: "pdf",
      size: "1.2 MB",
      category: uploadCategory || "Policies",
      folder: uploadFolder || "HR Policies",
      uploadedBy: "Sarah Johnson",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      shared: false,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    toast.success("Document uploaded successfully!");
    setUploadDialogOpen(false);
    setUploadCategory("");
    setUploadFolder("");
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const colors = ["bg-primary", "bg-accent", "bg-success", "bg-warning", "bg-destructive"];
    const newFolder: FolderItem = {
      id: Date.now(),
      name: newFolderName,
      filesCount: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setFolders((prev) => [...prev, newFolder]);
    toast.success(`Folder "${newFolderName}" created!`);
    setFolderDialogOpen(false);
    setNewFolderName("");
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast.success("Document deleted");
  };

  const handleDownload = (name: string) => {
    toast.success(`Downloading ${name}...`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <h1 className="sr-only">Document Management</h1>
        <Header />

        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Documents</h2>
              <p className="text-muted-foreground">Access and manage HR documents</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setFolderDialogOpen(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button variant="default" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{folders.length}</p>
                  <p className="text-sm text-muted-foreground">Folders</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} MB</p>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {documents.filter((d) => d.shared).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Shared Files</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Folders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-foreground">Folders</h3>
              {selectedFolder && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedFolder(null)}>
                  Clear filter
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(selectedFolder === folder.name ? null : folder.name)}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-left hover:shadow-card",
                    selectedFolder === folder.name
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", folder.color)}>
                    <Folder className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="font-medium text-foreground truncate">{folder.name}</p>
                  <p className="text-sm text-muted-foreground">{folder.filesCount} files</p>
                </button>
              ))}
            </div>
          </div>

          {/* Documents List */}
          <Card className="shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Folder</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Size</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Uploaded</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredDocuments.map((doc) => {
                      const FileIcon = fileTypeIcons[doc.type];
                      return (
                        <tr key={doc.id} className="hover:bg-secondary/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <FileIcon className={cn("w-5 h-5", fileTypeColors[doc.type])} />
                              <div>
                                <p className="font-medium text-foreground">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">by {doc.uploadedBy}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{doc.category}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{doc.folder}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{doc.size}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{doc.uploadedAt}</td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info(`Viewing ${doc.name}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(doc.name)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => {
                  const FileIcon = fileTypeIcons[doc.type];
                  return (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn("w-12 h-12 rounded-lg bg-secondary flex items-center justify-center")}>
                          <FileIcon className={cn("w-6 h-6", fileTypeColors[doc.type])} />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload(doc.name)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="font-medium text-foreground text-sm truncate mb-1">{doc.name}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground">PDF, DOC, XLS, PNG up to 10MB</p>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Folder</Label>
              <Select value={uploadFolder} onValueChange={setUploadFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.name}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
