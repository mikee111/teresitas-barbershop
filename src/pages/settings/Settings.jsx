import '../../styles/SharedAdminTable.css'
import '../../styles/settings/Settings.css'
import BusinessInfo from './BusinessInfo'
import SecuritySettings from './SecuritySettings'
import AdminSettings from './AdminSettings'
import CustomerAccounts from './CustomerAccounts'

function Settings({ activeSubNav = 'business-info', _onSelectSubNav, onUpdateUser, user }) {
  if (activeSubNav === 'business-info') {
    return <BusinessInfo />
  }

  if (activeSubNav === 'security') {
    return <SecuritySettings />
  }

  if (activeSubNav === 'admin') {
    return <AdminSettings onUpdateUser={onUpdateUser} user={user} />
  }

  if (activeSubNav === 'customer-accounts') {
    return <CustomerAccounts />
  }

  return <BusinessInfo />
}

export default Settings
