import React, { useEffect } from 'react'
import './Dashboard.css'
import Footer from './Footer'
import Content from './DashContent'
import { useSelector, useDispatch } from 'react-redux'
import * as creators from '../../state/actionCreators'
const Dashboard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(creators.getCurrentUser())
  }, [dispatch])
  const user = useSelector(state => state.user)
  const url = `${window.location.origin.toString()}/store/${user &&
    user.storeName &&
    user.storeName
      .toLowerCase()
      .split(' ')
      .join('-')}-${user && user._id}`

  return (
    <div className='mainDiv'>
      <div className='welcomeHeader'>
        Welcome, <br />
        <span className='name'>{user.ownerName}!</span>
        <p id='storeUrl'>{user && url}</p>
      </div>
      <div className='dashDiv'>
        <Content />
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard