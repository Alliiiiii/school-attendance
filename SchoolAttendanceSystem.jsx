import React, { useState } from 'react';

const SchoolAttendanceSystem = () => {
  // State for user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Mock data
  const students = [
    { id: 1, rollNumber: "001", name: "John Smith", class: "10A", section: "Science" },
    { id: 2, rollNumber: "002", name: "Emma Johnson", class: "10A", section: "Science" },
    { id: 3, rollNumber: "003", name: "Michael Brown", class: "10A", section: "Science" },
    { id: 4, rollNumber: "004", name: "Olivia Davis", class: "10B", section: "Arts" },
    { id: 5, rollNumber: "005", name: "William Wilson", class: "10B", section: "Arts" },
  ];
  
  const classes = [
    { id: 1, name: "10A", section: "Science", teacherId: 2 },
    { id: 2, name: "10B", section: "Arts", teacherId: 3 },
    { id: 3, name: "11A", section: "Science", teacherId: 4 },
  ];
  
  const users = [
    { id: 1, username: "principal", password: "admin", name: "Dr. Sarah Miller", role: "principal" },
    { id: 2, username: "teacher1", password: "pass123", name: "Daniel Clark", role: "teacher", class: "10A" },
    { id: 3, username: "teacher2", password: "pass123", name: "Emily Wright", role: "teacher", class: "10B" },
    { id: 4, username: "teacher3", password: "pass123", name: "Robert Johnson", role: "teacher", class: "11A" },
  ];
  
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState("");
  
  // Login handler
  const handleLogin = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      // For teachers, preselect their class
      if (user.role === 'teacher') {
        setSelectedClass(user.class);
      }
      
      return true;
    }
    return false;
  };
  
  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };
  
  // Save attendance handler
  const saveAttendance = (date, classId, attendance) => {
    const key = `${date}-${classId}`;
    setAttendanceData({
      ...attendanceData,
      [key]: attendance
    });
    return true;
  };
  
  // Get class students
  const getClassStudents = (className) => {
    return students.filter(student => student.class === className);
  };
  
  // Get classes for principal view
  const getClasses = () => {
    return classes;
  };
  
  // Get teacher classes
  const getTeacherClasses = (teacherId) => {
    return classes.filter(c => c.teacherId === teacherId);
  };

  // Get attendance for a specific date and class
  const getAttendance = (date, className) => {
    const key = `${date}-${className}`;
    return attendanceData[key] || [];
  };
  
  // Login component
  const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const attemptLogin = () => {
      if (handleLogin(username, password)) {
        setError("");
      } else {
        setError("Invalid username or password");
      }
    };
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">School Attendance System</h1>
            <p className="mt-2 text-gray-600">Login to your account</p>
          </div>
          
          {error && (
            <div className="p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter password"
              />
            </div>
            
            <button
              onClick={attemptLogin}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          
          <div className="mt-6 text-sm text-center text-gray-500">
            <p>Demo Accounts:</p>
            <p>Principal: username: principal, password: admin</p>
            <p>Teacher: username: teacher1, password: pass123</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Teacher Dashboard Component
  const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState("take");
    const [notification, setNotification] = useState(null);
    const [attendanceValues, setAttendanceValues] = useState({});
    
    const classStudents = getClassStudents(currentUser.class);
    
    const handleAttendanceChange = (studentId, status) => {
      setAttendanceValues({
        ...attendanceValues,
        [studentId]: status
      });
    };
    
    const submitAttendance = () => {
      // Ensure all students have attendance marked
      const allMarked = classStudents.every(student => 
        attendanceValues[student.id] !== undefined
      );
      
      if (!allMarked) {
        showNotification("Please mark attendance for all students", "error");
        return;
      }
      
      if (saveAttendance(selectedDate, currentUser.class, attendanceValues)) {
        showNotification("Attendance saved successfully", "success");
        // Reset form for new entries
        setAttendanceValues({});
      } else {
        showNotification("Error saving attendance", "error");
      }
    };
    
    const showNotification = (message, type) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    };
    
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">School Attendance</h2>
            <p className="text-sm opacity-75">Management System</p>
          </div>
          
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-400">Teacher - {currentUser.class}</div>
              </div>
            </div>
          </div>
          
          <nav className="mt-4">
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "take" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("take")}
            >
              <span className="mr-3">📋</span> Take Attendance
            </button>
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "view" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("view")}
            >
              <span className="mr-3">📊</span> View Records
            </button>
            <button
              className="w-full flex items-center px-4 py-3 hover:bg-gray-700"
              onClick={handleLogout}
            >
              <span className="mr-3">🚪</span> Logout
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "take" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Take Attendance - {currentUser.class}</h1>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md w-64"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">{student.rollNumber}</td>
                        <td className="px-6 py-4">{student.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className={`px-3 py-1 rounded ${attendanceValues[student.id] === 'present' ? 'bg-green-100 text-green-800 border-green-500' : 'border'}`}
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                            >
                              Present
                            </button>
                            <button
                              className={`px-3 py-1 rounded ${attendanceValues[student.id] === 'absent' ? 'bg-red-100 text-red-800 border-red-500' : 'border'}`}
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                            >
                              Absent
                            </button>
                            <button
                              className={`px-3 py-1 rounded ${attendanceValues[student.id] === 'late' ? 'bg-yellow-100 text-yellow-800 border-yellow-500' : 'border'}`}
                              onClick={() => handleAttendanceChange(student.id, 'late')}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={submitAttendance}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          )}
          
          {activeTab === "view" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">View Attendance Records - {currentUser.class}</h1>
              
              <div className="flex mb-6 space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <AttendanceList 
                date={selectedDate}
                className={currentUser.class}
                students={classStudents}
                attendance={getAttendance(selectedDate, currentUser.class)}
              />
            </div>
          )}
        </div>
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-md ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white shadow-lg`}>
            {notification.message}
          </div>
        )}
      </div>
    );
  };
  
  // Principal Dashboard Component
  const PrincipalDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [notification, setNotification] = useState(null);
    
    const showNotification = (message, type) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    };
    
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">School Attendance</h2>
            <p className="text-sm opacity-75">Management System</p>
          </div>
          
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-400">Principal</div>
              </div>
            </div>
          </div>
          
          <nav className="mt-4">
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "dashboard" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <span className="mr-3">📊</span> Dashboard
            </button>
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "attendance" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("attendance")}
            >
              <span className="mr-3">📋</span> Attendance
            </button>
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "students" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("students")}
            >
              <span className="mr-3">👨‍🎓</span> Students
            </button>
            <button
              className={`w-full flex items-center px-4 py-3 ${activeTab === "teachers" ? "bg-blue-600" : "hover:bg-gray-700"}`}
              onClick={() => setActiveTab("teachers")}
            >
              <span className="mr-3">👨‍🏫</span> Teachers
            </button>
            <button
              className="w-full flex items-center px-4 py-3 hover:bg-gray-700"
              onClick={handleLogout}
            >
              <span className="mr-3">🚪</span> Logout
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <DashboardCard title="Total Students" value="245" icon="👨‍🎓" color="blue" />
                <DashboardCard title="Total Teachers" value="18" icon="👨‍🏫" color="green" />
                <DashboardCard title="Classes" value="12" icon="🏫" color="purple" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-bold mb-4">Today's Attendance Overview</h2>
                  <div className="flex justify-around">
                    <StatItem label="Present" value="92%" color="green" />
                    <StatItem label="Absent" value="5%" color="red" />
                    <StatItem label="Late" value="3%" color="yellow" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-bold mb-4">Classes with Low Attendance</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>10B</span>
                      <span className="text-red-500">82%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>11A</span>
                      <span className="text-yellow-500">88%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "attendance" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Attendance Records</h1>
              
              <div className="flex mb-6 space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.name}>{c.name} - {c.section}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedClass && (
                <AttendanceList 
                  date={selectedDate}
                  className={selectedClass}
                  students={getClassStudents(selectedClass)}
                  attendance={getAttendance(selectedDate, selectedClass)}
                />
              )}
            </div>
          )}
          
          {activeTab === "students" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Students Management</h1>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4">{student.rollNumber}</td>
                        <td className="px-6 py-4">{student.name}</td>
                        <td className="px-6 py-4">{student.class}</td>
                        <td className="px-6 py-4">{student.section}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === "teachers" && (
            <div>
              <h1 className="text-2xl font-bold mb-6">Teachers Management</h1>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => u.role === 'teacher').map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-6 py-4">{teacher.name}</td>
                        <td className="px-6 py-4">{teacher.class}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-md ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white shadow-lg`}>
            {notification.message}
          </div>
        )}
      </div>
    );
  };
  
  // Helper Components
  const DashboardCard = ({ title, value, icon, color }) => {
    const bgColors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${bgColors[color]} mr-4`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  };
  
  const StatItem = ({ label, value, color }) => {
    const textColors = {
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
    };
    
    return (
      <div className="text-center">
        <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    );
  };
  
  const AttendanceList = ({ date, className, students, attendance }) => {
    if (!students || students.length === 0) {
      return <div className="bg-yellow-100 p-4 rounded-md">No students found for selected class</div>;
    }
    
    if (!attendance || Object.keys(attendance).length === 0) {
      return <div className="bg-yellow-100 p-4 rounded-md">No attendance data for this date</div>;
    }
    
    const getStatusBadge = (status) => {
      const badges = {
        present: "bg-green-100 text-green-800",
        absent: "bg-red-100 text-red-800",
        late: "bg-yellow-100 text-yellow-800",
      };
      return badges[status] || "";
    };
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.rollNumber}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">
                  {attendance[student.id] ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(attendance[student.id])}`}>
                      {attendance[student.id].charAt(0).toUpperCase() + attendance[student.id].slice(1)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not marked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="school-attendance-system">
      {!isLoggedIn ? (
        <Login />
      ) : (
        currentUser.role === 'principal' ? <PrincipalDashboard /> : <TeacherDashboard />
      )}
    </div>
  );
};

export default SchoolAttendanceSystem;