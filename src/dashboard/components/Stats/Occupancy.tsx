// src/dashboard/components/Stats/Occupancy.tsx
import { Percent, Home, DoorOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Occupancy() {
 const stats = {
   total: 20,
   occupied: 17,
   rate: 85,
   avgDuration: '14 months'
 };

 return (
   <Card>
     <CardContent className="p-6">
       <div className="space-y-4">
         <div className="flex justify-between items-center">
           <div>
             <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
             <p className="text-2xl font-semibold">{stats.rate}%</p>
           </div>
           <Home className="h-8 w-8 text-green-600" />
         </div>
         <div className="grid grid-cols-2 gap-4 pt-4 border-t">
           <div>
             <p className="text-sm text-gray-500">Occupied Units</p>
             <p className="font-medium">{stats.occupied}/{stats.total}</p>
           </div>
           <div>
             <p className="text-sm text-gray-500">Avg. Tenancy</p>
             <p className="font-medium">{stats.avgDuration}</p>
           </div>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}

