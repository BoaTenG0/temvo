// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart, PasswordCheck, CpuCharge, Home } from 'iconsax-react';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  pos: PasswordCheck,
  cpu: CpuCharge,
  home: Home
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget = {
  id: 'group-widget',
  title: <FormattedMessage id="navigation" />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="Dashboard" />,
      type: 'item',
      url: '/widget/statistics',
      icon: icons.home
    },
    {
      id: 'schools',
      title: <FormattedMessage id="Schools" />,
      type: 'item',
      url: '/widget/data',
      icon: icons.data
    },
    {
      id: 'nfc',
      title: <FormattedMessage id="NFC Wristbands" />,
      type: 'collapse',
      icon: icons.cpu,
      children: [
        {
          id: 'all-nfc-wristbands',
          title: <FormattedMessage id="All NFC Wristbands" />,
          type: 'item',
          url: '/apps/customer/customer-list'
        },
        {
          id: 'register-nfc-wristband',
          title: <FormattedMessage id="Register NFC Wristbands" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        },
        {
          id: 'register-bulk-wristband',
          title: <FormattedMessage id="Register Bulk Wristbands" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        },
        {
          id: 'Assign Wristbands',
          title: <FormattedMessage id="Assign Wristbands" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        }
      ]
    },
    {
      id: 'pos',
      title: <FormattedMessage id="POS Management" />,
      type: 'collapse',
      icon: icons.pos,
      children: [
        {
          id: 'all-pos-devices',
          title: <FormattedMessage id="All POS Device" />,
          type: 'item',
          url: '/apps/customer/customer-list'
        },
        {
          id: 'register-nfc-wristband',
          title: <FormattedMessage id="Register New POS" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        },
        {
          id: 'register-bulk-wristband',
          title: <FormattedMessage id="Register Bulk POS" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        },
        {
          id: 'Assign Wristbands',
          title: <FormattedMessage id="Assign POS" />,
          type: 'item',
          url: '/apps/customer/customer-card'
        }
      ]
    }
  ]
};

export default widget;
