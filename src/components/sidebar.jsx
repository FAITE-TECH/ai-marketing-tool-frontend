import React from 'react'
import { FaHome } from 'react-icons/fa'
import { FaInfoCircle } from 'react-icons/fa'
import { FaChartLine } from 'react-icons/fa'
import { FaEdit } from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa'
import { FaRobot } from 'react-icons/fa'
import { FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom'



const Sidebar = () => {
  return (
    <div className='w-66 bg-gray-800 fixed h-full px-2 py-2'>
      <div className='-my-2 mb-2 flex items-center gap-2 p-4'>
  <FaRobot className='text-white w-6 h-6' />
  <h1 className='text-xl text-white font-bold'>AI Marketing Tools</h1>
</div>

      <hr className='-mt-3 border-gray-600'/>
      <ul className='mt-3 text-white font-bold'>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
          <Link to="/" className='px-3 flex items-center'>
            <FaHome className='w-6 h-6 mr-2' />
            Home
            </Link>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
          <Link to="/about" className='px-3 flex items-center'>
            <FaInfoCircle className='w-6 h-6 mr-2' />
            About us
          </Link>
        </li>

        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
          <Link to="/LeadScoring" className='px-3 flex items-center'>
            <FaChartLine className='w-6 h-6 mr-2' />
            Lead scoring
          </Link>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <Link to="/ContentEditor" className='px-3 flex items-center'>
            <FaEdit className='w-6 h-6 mr-2' />
            Content editing
            </Link>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
            <Link to="/CampaignSchedulerPage" className='px-3 flex items-center'>
            <FaCalendarAlt className='w-6 h-6 mr-2' />
            Campaign schedule
            </Link>
        </li>
        <li className='mb-2 rounded hover:shadow hover:bg-blue-500 py-2'>
          <Link to="/ChatbotPage" className='px-3 flex items-center'>
            <FaCommentDots className='w-6 h-6 mr-2' />
            Chat bot
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
