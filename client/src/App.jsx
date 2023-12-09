import { Fragment } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homepage from './components/Homepage/Homepage'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Verify from './components/Register/Verify'
import DashboardLayout from './Layouts/DashboardLayout'
import Profile from './components/Profile/Profile';
import Accounts from './components/Accounts/Accounts';
import Transfers from './components/Transfers/Transfers';
import Contacts from './components/Contacts/Contacts';

function App() {
  return (
    <div className='w-screen h-screen bg-[#0E4C92] text-white'>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/accounts" element={<Accounts />} />
          <Route path="/dashboard/transfers" element={<Transfers />} />
          <Route path="/dashboard/contacts" element={<Contacts />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
