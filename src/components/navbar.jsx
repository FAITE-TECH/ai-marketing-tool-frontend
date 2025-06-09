import React, { useState } from 'react'
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const searchableItems = [
  { label: 'About Us', path: '/about' },
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
  { label: 'Lead Scoring', path: '/LeadScoring' },
  { label: 'Content Editor', path: '/ContentEditor' },
  { label: 'Chatbot', path: '/ChatbotPage' },
  { label: 'Campaign Scheduler', path: '/CampaignSchedulerPage' },
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
  { label: 'Scheduled Campaigns', path: '/scheduled-campaigns' },
]

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const navigate = useNavigate()

  // You can add notifications here
  const mockNotifications = [] // Example: ['New message received']

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (path) => {
    setSearchQuery('')
    setShowSuggestions(false)
    navigate(path)
  }

  const filteredSuggestions = searchableItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <nav className='bg-gray-800 px-4 py-3 flex justify-end ml-64'>
      <div className='flex items-center gap-x-5 relative'>

        {/* Search bar */}
        <div className='relative md:w-64'>
          <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
            <button className='p-1 focus:outline-none text-white'>
              <FaSearch />
            </button>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => setShowSuggestions(true)}
            className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block bg-gray-700 text-white placeholder-gray-300'
            placeholder="Search..."
          />
          {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
            <ul className="absolute z-20 w-full bg-white rounded shadow-md mt-1 max-h-60 overflow-auto text-gray-800">
              {filteredSuggestions.map((item) => (
                <li
                  key={item.label}
                  onMouseDown={() => handleSuggestionClick(item.path)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notification icon */}
        <div className='relative text-white'>
          <button onClick={toggleNotifications} className='relative'>
            <FaBell className='w-6 h-6' />
          </button>

          {notificationsOpen && (
            <div className='absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
              <div className='p-2 text-sm font-medium border-b'>Notifications</div>
              {mockNotifications.length === 0 ? (
                <div className='px-4 py-3 text-sm text-gray-500'>No notifications for now</div>
              ) : (
                <ul className='max-h-64 overflow-y-auto'>
                  {mockNotifications.map((note, index) => (
                    <li key={index} className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User Icon with Dropdown */}
        <div className='relative text-white'>
          <button className='flex items-center' onClick={toggleDropdown}>
            <FaUserCircle className='w-6 h-6 mt-1' />
          </button>
          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10'>
              <ul className='py-2 text-sm'>
                <li>
                  <a href="/profile" className='block px-4 py-2 hover:bg-gray-100 transition-colors duration-150'>
                    👤 Profile
                  </a>
                </li>
                <li>
                  <a href="#" className='block px-4 py-2 hover:bg-gray-100 transition-colors duration-150'>
                    ⚙️ Settings
                  </a>
                </li>
                <li><hr className='my-1 border-gray-200' /></li>
                <li>
                  <a href="/Logout" className='block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-150'>
                    🚪 Log Out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
