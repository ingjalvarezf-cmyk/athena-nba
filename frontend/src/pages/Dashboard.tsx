import { Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header className="border-b border-athena-turquoise/20 pb-6">
        <h1 className="text-3xl font-bold text-athena-white">System Overview</h1>
        <p className="text-athena-gray mt-2">ATHENA NBA 1.0 - Motor Predictivo Híbrido</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-athena-electric p-6 rounded-xl border border-athena-turquoise/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-athena-light/10 rounded-lg"><Activity className="text-athena-light w-5 h-5" /></div>
            <h2 className="text-lg font-semibold">Status</h2>
          </div>
          <p className="text-athena-gray text-sm">DEV-003 Fase 2 Completada.</p>
          <p className="text-green-400 text-sm mt-2 font-mono">● UI En línea</p>
        </div>
      </div>
    </div>
  );
}
