import React from 'react';
import { Button } from "@/components/ui/button";
import {
 Card,
 CardContent,
} from "@/components/ui/card";
import { Building2, Wallet, FileText, Settings, Menu } from 'lucide-react';

export default function DashboardLayout({
 children
}: {
 children: React.ReactNode
}) {
 return (
   <div className="min-h-screen bg-gray-100">
     <nav className="bg-white shadow-sm">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="flex h-16 justify-between">
           <div className="flex">
             <div className="flex flex-shrink-0 items-center">
               <Building2 className="h-8 w-8 text-blue-600" />
               <span className="ml-2 text-xl font-bold">PropTech</span>
             </div>
             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
               <Button variant="ghost">Properties</Button>
               <Button variant="ghost">Financial</Button>
               <Button variant="ghost">Documents</Button>
             </div>
           </div>
           <div className="flex items-center">
             <Button variant="outline" className="mr-4">
               <Wallet className="h-5 w-5" />
               <span className="ml-2">Connect Wallet</span>
             </Button>
             <Button variant="ghost">
               <Settings className="h-5 w-5" />
             </Button>
           </div>
         </div>
       </div>
     </nav>

     <main className="py-10">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         {children}
       </div>
     </main>
   </div>
 );
}

