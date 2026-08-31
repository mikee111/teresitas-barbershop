import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'
import BusinessInfo from './BusinessInfo'
import SecuritySettings from './SecuritySettings'
import AdminSettings from './AdminSettings'

function Settings({ activeSubNav = 'business-info', onSelectSubNav }) {
  if (activeSubNav === 'business-info') {
    return <BusinessInfo />
  }

  if (activeSubNav === 'security') {
    return <SecuritySettings />
  }

  if (activeSubNav === 'admin') {
    return <AdminSettings />
  }

  return <BusinessInfo />
}

export default Settings
