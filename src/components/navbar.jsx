import React, { useState } from 'react'
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa'

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <nav className='bg-gray-800 px-4 py-3 flex justify-end ml-64'>
      <div className='flex items-center gap-x-5'>
        {/* Search bar */}
        <div className='relative md:w-64'>
          <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
            <button className='p-1 focus:outline-none text-white'>
              <FaSearch />
            </button>
          </span>
          <input
            type="text"
            className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block bg-gray-700 text-white placeholder-gray-300'
            placeholder="Search..."
          />
        </div>

        {/* Notification icon */}
        <div className='text-white'>
          <FaBell className='w-6 h-6' />
        </div>

        {/* User Icon with Dropdown */}
        <div className='relative text-white'>
          <button
            className='flex items-center'
            onClick={toggleDropdown}
          >
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
                  <a href="#" className='block px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-150'>
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