// src/dashboard/components/Actions/QuickActions.tsx
import { Plus, Key, Tool, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuickActions() {
 const actions = [
   {
     icon: <Plus className="h-5 w-5" />,
     label: "Add Property",
     action: () => console.log("Add property")
   },
   {
     icon: <Key className="h-5 w-5" />,
     label: "New Lease",
     action: () => console.log("New lease")
   },
   {
     icon: <Tool className="h-5 w-5" />,
     label: "Maintenance",
     action: () => console.log("Maintenance")
   },
   {
     icon: <FileText className="h-5 w-5" />,
     label: "Documents",
     action: () => console.log("Documents")
   }
 ];

 return (
   <Card>
     <CardHeader>
       <CardTitle>Quick Actions</CardTitle>
     </CardHeader>
     <CardContent className="grid grid-cols-2 gap-4">
       {actions.map((action, index) => (
         <Button 
           key={index}
           variant="outline"
           className="flex items-center justify-center gap-2 h-20"
           onClick={action.action}
         >
           {action.icon}
           {action.label}
         </Button>
       ))}
     </CardContent>
   </Card>
 );
}

