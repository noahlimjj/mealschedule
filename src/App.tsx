import { useMeal } from './context/MealContextFirebase';
import GroupSetup from './components/GroupSetup';
import UserSelector from './components/UserSelector';
import MealGrid from './components/MealGrid';

function App() {
  const { currentGroup } = useMeal();

  if (!currentGroup) {
    return <GroupSetup />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {currentGroup.name}
          </h1>
          <p className="text-gray-600">
            Track lunch and dinner for the week
          </p>
        </div>

        {/* User Selector */}
        <UserSelector />

        {/* Meal Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <MealGrid />
        </div>
      </div>
    </div>
  );
}

export default App;
