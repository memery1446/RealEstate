// src/app/dashboard/page.tsx
import PropertyCount from '@/components/dashboard/PropertyCount'
import Occupancy from '@/components/dashboard/Occupancy'
import Revenue from '@/components/dashboard/Revenue'
import { ConnectButton } from '@/components/ui/ConnectButton'
import QuickActions from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-7xl">
        <div className="flex justify-end mb-8">
          <ConnectButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">Property Management Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActions />
          <PropertyCount />
          <Occupancy />
          <Revenue />
        </div>
      </div>
    </main>
  )
}

