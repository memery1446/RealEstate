// src/dashboard/components/Alerts/AlertList.tsx
import { Bell, Tool, Key, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AlertList() {
 const alerts = [
   {
     icon: <Tool className="h-5 w-5 text-yellow-500" />,
     title: "Maintenance Request",
     description: "Unit 4B reported AC issues",
     time: "2h ago"
   },
   {
     icon: <Key className="h-5 w-5 text-green-500" />,
     title: "Lease Expiring",
     description: "Unit 2A lease ends in 30 days",
     time: "1d ago"
   },
   {
     icon: <DollarSign className="h-5 w-5 text-red-500" />,
     title: "Payment Overdue",
     description: "Unit 3C rent payment is 5 days late",
     time: "5d ago"
   }
 ];

 return (
   <Card className="mt-6">
     <CardHeader>
       <CardTitle className="flex items-center">
         <Bell className="mr-2 h-5 w-5" />
         Recent Alerts
       </CardTitle>
     </CardHeader>
     <CardContent>
       <div className="space-y-4">
         {alerts.map((alert, index) => (
           <div key={index} className="flex items-start space-x-4 p-2 hover:bg-gray-50 rounded-lg">
             {alert.icon}
             <div className="flex-1">
               <p className="font-medium">{alert.title}</p>
               <p className="text-sm text-gray-500">{alert.description}</p>
             </div>
             <span className="text-xs text-gray-400">{alert.time}</span>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>
 );
}

