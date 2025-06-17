import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSettings, FiHeart, FiBookmark, FiUser, FiBarChart2, FiLogOut, FiExternalLink, FiTrash2, FiEdit3, FiCheck, FiX, FiMoon, FiSun, FiPlus, FiSearch  } from "react-icons/fi";

const AdminDash = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const navigate = useNavigate();
  
  const userDataLo = JSON.parse(localStorage.getItem("user")) || {};

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/activity`,
        {
          userId: userData._id,
          comment: `logged out at ${new Date().toLocaleString()}`,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log logout activity:", error);
      logout();
      navigate("/login");
    }
  };

  const handlelogged = localStorage.getItem("token");
  if (!handlelogged) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          if (user.role !== "admin") {
            navigate("/dashboard");
            return;
          }
        } else {
          navigate("/login");
          return; 
        }

        const response = await axios.get(`http://localhost:5000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        if(response.data.image) {
          setImgUrl(response.data.image);
        }
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userData?._id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.image) {
        const imagePath = `${res.data.image}`;
        const updatedUser = { ...userData, image: imagePath };
        setUserData(updatedUser);
        setImgUrl(updatedUser.image);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col w-64 ${darkMode ? 'bg-gradient-to-b from-gray-800 to-gray-700' : 'bg-gradient-to-b from-purple-900 to-purple-700'} text-white`}>
          <div className={`flex items-center justify-between h-16 px-4 border-b ${darkMode ? 'border-gray-600' : 'border-purple-800'}`}>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-600 transition md:block hidden"
            >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            </div>
          <div className="flex flex-col flex-grow px-4 py-8">
            <div className="flex flex-col items-center mb-8">
              <label className="relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <img
                  src={imgUrl ? `${imgUrl}` : "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-300 cursor-pointer hover:opacity-90 transition"
                />
                <div className="absolute bottom-0 right-0 bg-white text-purple-700 p-1 rounded-full">
                  <FiUser className="w-4 h-4" />
                </div>
              </label>
              <h2 className="mt-4 text-lg usernameUpdate font-semibold">{userData?.name || "User"}</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-purple-200'} useremailUpdate text-sm`}>{userData?.email || "user@example.com"}</p>
            </div>
            
            <nav className="flex-1 space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                  activeTab === "overview" 
                    ? `${darkMode ? 'bg-gray-600' : 'bg-purple-600'} text-white` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-purple-200 hover:bg-purple-800'}`
                }`}
              >
                <FiBarChart2 className="mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
                  activeTab === "users" 
                    ? `${darkMode ? 'bg-gray-600' : 'bg-purple-600'} text-white` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-purple-200 hover:bg-purple-800'}`
                }`}
              >
                <FiUser className="mr-3" />
                User Management
              </button>
              
            </nav>
            
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 mt-auto ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-purple-200 hover:bg-purple-800'} rounded-lg transition`}
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className={`hidden ${darkMode ? 'bg-gray-800' : 'bg-purple-700'} text-white p-4 flex justify-between items-center`}>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-600">
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
          <button className="p-2 rounded-full bg-purple-600">
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Mobile profile header */}
            <div className="md:hidden flex items-center mb-6">
              <label className="relative mr-4">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <img
                  src={imgUrl ? `${imgUrl}` : "https://ui-avatars.com/api/?name=" + (userData?.name || "User") + "&background=random"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-300 cursor-pointer"
                />
              </label>
              <div>
                <h2 className={`text-lg usernameUpdate font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{userData?.name || "User"}</h2>
                <p className={`text-sm useremailUpdate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{userData?.email || "user@example.com"}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleLogout}
                  className={`flex items-center px-4 py-2 text-white ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-700 hover:bg-purple-800'} rounded-lg transition`}
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile tabs */}
            <div className="md:hidden flex overflow-x-auto mb-6 pb-2 space-x-2">
              {["overview", "users"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    activeTab === tab 
                      ? `${darkMode ? 'bg-gray-600' : 'bg-purple-600'} text-white` 
                      : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                  }`}
                >
                  {tab === "users" ? "User Management" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-600">
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
            </div>

            {/* Dashboard content */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
              {activeTab === "overview" && <OverviewTab userData={userData} darkMode={darkMode} />}
              {activeTab === "users" && <UsersTab userData={userData} darkMode={darkMode} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const OverviewTab = ({ userData, darkMode }) => {
  const [activities, setActivities] = useState([]);
  const [savedItemsCount, setSavedItemsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [todayActivitiesCount, setTodayActivitiesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/activity", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;

        setSavedItemsCount(data.counts.savedRecipes || 0);
        setFavoritesCount(data.counts.favorites || 0);
        setTodayActivitiesCount(data.counts.todayActivitiesCount || 0);
        setActivities(data.activities || []);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="p-3">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
        Welcome back, {userData?.name || "User"}!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-purple-50 to-indigo-50'} p-6 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Saved Items</h3>
          <p className="text-3xl font-bold text-purple-600">{savedItemsCount}</p>
          
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-cyan-900' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} p-6 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Favorites</h3>
          <p className="text-3xl font-bold text-blue-600">{favoritesCount}</p>
          
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-r from-green-900 to-teal-900' : 'bg-gradient-to-r from-green-50 to-teal-50'} p-6 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Today's Activity</h3>
          <p className="text-3xl font-bold text-green-600">{todayActivitiesCount}</p>
          
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-3`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Recent Activity</h3>
        {loading ? (
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading activities...</p>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <li key={activity._id} className="flex items-start">
                <div className={`${darkMode ? 'bg-purple-800' : 'bg-purple-100'} p-2 rounded-full mr-3`}>
                  <FiBookmark className="text-purple-600" />
                </div>
                <div>
                  <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{userData.name} {activity.comment}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UsersTab = ({ userData, darkMode }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/adminuser?page=${currentPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/adminuser', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.response.data.message);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/adminuser/${selectedUser._id}`, {
        name: formData.name,
        email: formData.email
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response.data.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/adminuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Users </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white  rounded-lg transition`}
        >
          <FiPlus className="mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden shadow`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      User
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Email
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Role
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${darkMode ? 'bg-gray-700' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                    : `${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                    : `${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New User</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Password (minimum 8 characters)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  minLength="8"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDash;