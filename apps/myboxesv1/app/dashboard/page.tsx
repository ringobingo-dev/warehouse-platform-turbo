import { useStore } from 'ui';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">User Information</h2>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Organization:</span> {user.organizationId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 