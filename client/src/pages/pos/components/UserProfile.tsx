import { useState } from "react";
import { User, currentUser, hasPermission } from "../utils/posHelpers";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserProfileProps {
  user?: User;
  onRoleChange?: (role: 'admin' | 'cashier') => void;
}

export default function UserProfile({ 
  user = currentUser,
  onRoleChange
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<'admin' | 'cashier'>(user.role);
  
  const roleLabels = {
    admin: "Administrator",
    cashier: "Cashier"
  };
  
  const permissions = [
    { id: 'view_reports', label: 'View Sales Reports' },
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'process_refunds', label: 'Process Refunds' },
    { id: 'view_sales', label: 'View Sales Data' },
    { id: 'process_sales', label: 'Process Sales' }
  ];
  
  const handleRoleChange = (role: 'admin' | 'cashier') => {
    setCurrentRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost" 
        className="neu-button flex items-center space-x-2 dark:bg-gray-800"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-[#6366F1] text-white">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{roleLabels[user.role]}</span>
        </div>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="neu-bg dark:bg-gray-800 border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">User Profile</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              View and manage your user settings and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl bg-[#6366F1] text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID: {user.id}</p>
                
                <div className="mt-2">
                  <Select 
                    value={currentRole} 
                    onValueChange={(value) => handleRoleChange(value as 'admin' | 'cashier')}
                  >
                    <SelectTrigger className="neu-input w-[140px] dark:bg-gray-700 dark:text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="neu-bg dark:bg-gray-700">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator className="dark:bg-gray-700" />
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Permissions</h4>
              <div className="space-y-3">
                {permissions.map(permission => {
                  const hasPermissionValue = hasPermission({ ...user, role: currentRole }, permission.id);
                  
                  return (
                    <div key={permission.id} className="flex items-center justify-between">
                      <Label 
                        htmlFor={`permission-${permission.id}`}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {permission.label}
                      </Label>
                      <Switch
                        id={`permission-${permission.id}`}
                        checked={hasPermissionValue}
                        disabled={true} // Disable since we're calculating based on role
                        className="data-[state=checked]:bg-[#6366F1]"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Permissions are determined by your assigned role.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="neu-button dark:bg-gray-700 dark:text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}