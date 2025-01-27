// src/dashboard/components/Stats/PropertyCount.tsx
export default function PropertyCount() {
 return (
   <Card>
     <CardContent className="p-6">
       <div className="flex items-center">
         <Building2 className="h-8 w-8 text-blue-600" />
         <div className="ml-4">
           <p className="text-sm font-medium text-gray-500">Total Properties</p>
           <p className="text-2xl font-semibold">12</p>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}

// src/dashboard/components/Stats/Occupancy.tsx
export default function Occupancy() {
 return (
   <Card>
     <CardContent className="p-6">
       <div className="flex items-center">
         <Key className="h-8 w-8 text-green-600" />
         <div className="ml-4">
           <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
           <p className="text-2xl font-semibold">85%</p>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}

// src/dashboard/components/Stats/Revenue.tsx
export default function Revenue() {
 return (
   <Card>
     <CardContent className="p-6">
       <div className="flex items-center">
         <DollarSign className="h-8 w-8 text-purple-600" />
         <div className="ml-4">
           <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
           <p className="text-2xl font-semibold">$24,500</p>
         </div>
       </div>
     </CardContent>
   </Card>
 );
}

