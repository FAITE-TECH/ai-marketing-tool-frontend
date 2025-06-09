import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Sidebar from './components/sidebar'
import Navbar from './components/navbar' 
import Dashboard from './components/dashboard'
import Profile from './components/Profile'
import Footer from './components/footer'
import Home from './components/Home'
import AboutUs from './components/AboutUs'
import LeadScoring from './components/LeadScoring'
import ContentEditor from './components/ContentEditor'
import ChatbotPage from './components/ChatbotPage'
import CampaignSchedulerPage from './components/CampaignSchedulerPage'
import Login from './components/login'
import Register from './components/Register';
import ScheduledCampaigns from './components/ScheduledCampaigns';
import Logout from './components/Logout';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <div className='flex flex-1'>
          <Sidebar />
          <div className='flex-1'>
            <Navbar /> 
            <Routes>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path="/" element={<Home />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='/LeadScoring' element={<LeadScoring />} />
              <Route path='/ContentEditor' element={<ContentEditor />} />
              <Route path='/ChatbotPage' element={<ChatbotPage />} />
              <Route path='/CampaignSchedulerPage' element={<CampaignSchedulerPage />} />
              <Route path='/login' element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/scheduled-campaigns" element={<ScheduledCampaigns />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
