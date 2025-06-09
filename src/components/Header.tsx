interface HeaderProps {
  completionRate: number;
  currentDate: string;
  onDateChange: (date: string) => void;
}

const Header: React.FC<HeaderProps> = ({ completionRate, currentDate, onDateChange }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Day Planning Dashboard</h1>
        <p className="text-gray-600 mt-1">Plan, prioritize, and achieve your daily goals</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 px-4 py-2 rounded-lg">
          <span className="text-indigo-800 font-semibold">{completionRate}% Complete</span>
        </div>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>
);

export default Header;