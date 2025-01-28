// src/dashboard/components/Stats/Revenue.tsx
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Revenue() {
 const stats = {
   monthly: 24500,
   growth: 8.2,
   pending: 3200,
   overdue: 1500
 };

 return (
   <Card>
     <CardContent className="p-6">
       <div className="space-y-4">
         <div className="flex justify-between items-center">
           <div>
             <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
             <p className="text-2xl font-semibold">${stats.monthly.toLocaleString()}</p>
           </div>
           <TrendingUp className="h-8 w-8 text-purple-600" />
         </div>
         <div className="grid grid-cols-2 gap-4 pt-4 border-t">
           <div>
             <p className="text-sm text-gray-500">Growth</p>
             <p className="font-medium text-green-600">+{stats.growth}%</p>
           </div>
           <div>
             <p className="text-sm text-gray-500">Pending</p>
             <p className="font-medium text-yellow-600">${stats.pending}</p>
           </div>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}

