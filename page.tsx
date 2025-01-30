// src/dashboard/page.tsx
import PropertyCount from './components/Stats/PropertyCount';
import Occupancy from './components/Stats/Occupancy';
import Revenue from './components/Stats/Revenue';
import AlertList from './components/Alerts/AlertList';
import QuickActions from './components/dashboard/QuickActions';
import DashboardLayout from './layout/DashboardLayout';

export default function Dashboard() {
 return (
   <DashboardLayout>
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
       <PropertyCount />
       <Occupancy />
       <Revenue />
     </div>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
       <QuickActions />
       <AlertList />
     </div>
   </DashboardLayout>
 );
}

