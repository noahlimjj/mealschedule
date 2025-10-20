import UserSelector from './components/UserSelector';
import MealGrid from './components/MealGrid';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Meal Schedule
          </h1>
          <p className="text-gray-600">
            Track lunch and dinner for the week
          </p>
        </div>

        {/* User Selector */}
        <UserSelector />

        {/* Meal Grid */}
        <MealGrid />
      </div>
    </div>
  );
}

export default App;
