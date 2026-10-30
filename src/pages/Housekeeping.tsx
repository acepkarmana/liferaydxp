import { useState } from 'react';
import { HousekeepingTask, CleanupResult, LiferayConfig } from '../types';
import { mockHousekeepingTasks } from '../data/mockData';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Trash2,
  FolderOpen,
  Database,
  Calendar,
  HardDrive,
  Search,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HousekeepingProps {
  config: LiferayConfig;
}

const categoryIcons: Record<string, React.ReactNode> = {
  roles: <Shield size={20} />,
  folders: <FolderOpen size={20} />,
  objects: <Database size={20} />,
  calendar: <Calendar size={20} />,
  general: <HardDrive size={20} />,
};

const categoryColors: Record<string, string> = {
  roles: 'bg-blue-50 text-blue-600 border-blue-200',
  folders: 'bg-green-50 text-green-600 border-green-200',
  objects: 'bg-purple-50 text-purple-600 border-purple-200',
  calendar: 'bg-orange-50 text-orange-600 border-orange-200',
  general: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function Housekeeping({ config }: HousekeepingProps) {
  const [tasks, setTasks] = useState<HousekeepingTask[]>(mockHousekeepingTasks);
  const [results, setResults] = useState<CleanupResult[]>([]);
  const [runningTask, setRunningTask] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConfirmModal, setShowConfirmModal] = useState<HousekeepingTask | null>(null);

  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === selectedCategory);

  const runTask = async (task: HousekeepingTask) => {
    setShowConfirmModal(null);
    setRunningTask(task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'running' as const } : t));

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const itemsProcessed = Math.floor(Math.random() * 100) + 10;
    const itemsRemoved = Math.floor(itemsProcessed * (0.3 + Math.random() * 0.5));

    const isSuccess = Math.random() > 0.1;
    const result: CleanupResult = {
      taskId: task.id,
      success: isSuccess,
      itemsProcessed,
      itemsRemoved,
      duration: Math.floor(2000 + Math.random() * 3000),
      message: isSuccess
        ? `Successfully cleaned up ${itemsRemoved} items out of ${itemsProcessed} processed.`
        : 'Task completed with some warnings. Check logs for details.',
      timestamp: new Date().toISOString(),
    };

    setResults(prev => [result, ...prev]);
    setTasks(prev => prev.map(t => t.id === task.id ? {
      ...t,
      status: result.success ? 'completed' as const : 'failed' as const,
      lastRun: result.timestamp,
      itemCount: result.itemsRemoved,
    } : t));
    setRunningTask(null);

    if (result.success) {
      toast.success(`${task.name} completed successfully`);
    } else {
      toast.error(`${task.name} completed with warnings`);
    }
  };

  const resetTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'idle' as const } : t));
    toast.success('Task status reset');
  };

  const runAllTasks = async () => {
    for (const task of filteredTasks) {
      if (task.status !== 'running') {
        await runTask(task);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'idle':
        return <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"><Clock size={10} /> Idle</span>;
      case 'running':
        return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"><Loader2 size={10} className="animate-spin" /> Running</span>;
      case 'completed':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full"><CheckCircle2 size={10} /> Completed</span>;
      case 'failed':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full"><AlertCircle size={10} /> Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housekeeping</h1>
          <p className="text-sm text-gray-500 mt-1">Maintenance tasks for Liferay DXP cleanup and optimization</p>
        </div>
        <button
          onClick={runAllTasks}
          disabled={runningTask !== null}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={14} />
          Run All Tasks
        </button>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Important Notice</p>
            <p className="text-xs text-amber-600 mt-1">
              Housekeeping operations may affect portal performance. It is recommended to run these tasks during off-peak hours.
              Some operations are irreversible. Ensure you have proper backups before proceeding.
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Target: <code className="bg-amber-100 px-1 rounded">{config.baseUrl}</code> (Company ID: {config.companyId})
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'roles', 'folders', 'objects', 'calendar', 'general'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`bg-white rounded-xl border border-gray-200 p-5 ${
            task.status === 'running' ? 'ring-2 ring-blue-200' : ''
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${categoryColors[task.category]}`}>
                  {categoryIcons[task.category]}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{task.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{task.category}</span>
                </div>
              </div>
              {getStatusBadge(task.status)}
            </div>
            <p className="text-xs text-gray-500 mt-3">{task.description}</p>

            {task.lastRun && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  Last run: {new Date(task.lastRun).toLocaleString()}
                  {task.itemCount !== undefined && ` • ${task.itemCount} items cleaned`}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4">
              {task.status === 'idle' || task.status === 'completed' || task.status === 'failed' ? (
                <button
                  onClick={() => setShowConfirmModal(task)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  <Play size={12} />
                  Run Task
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-400 rounded-lg text-xs font-medium cursor-not-allowed"
                >
                  <Loader2 size={12} className="animate-spin" />
                  Processing...
                </button>
              )}
              {(task.status === 'completed' || task.status === 'failed') && (
                <button
                  onClick={() => resetTask(task.id)}
                  className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  title="Reset status"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Results History */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution History</h3>
          <div className="space-y-3">
            {results.slice(0, 10).map((result, idx) => {
              const task = tasks.find(t => t.id === result.taskId);
              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task?.name || result.taskId}</p>
                      <p className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {result.itemsRemoved} / {result.itemsProcessed} items
                    </p>
                    <p className="text-xs text-gray-500">{(result.duration / 1000).toFixed(1)}s</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Confirm Execution</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-900">{showConfirmModal.name}</p>
              <p className="text-xs text-gray-500 mt-1">{showConfirmModal.description}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to run this housekeeping task? This will permanently modify data in your Liferay instance.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => runTask(showConfirmModal)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Run Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
