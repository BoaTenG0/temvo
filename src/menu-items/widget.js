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
      url: '/dashboard/default',
      icon: icons.home
    },
    {
      id: 'nfc',
      title: <FormattedMessage id="NFC Wristbands" />,
      type: 'item',
      url: '/nfc-wristbands',
      icon: icons.cpu
    },
    {
      id: 'pos',
      title: <FormattedMessage id="POS Management" />,
      type: 'item',
      url: '/pos-management',
      icon: icons.pos
    },
    {
      id: 'schools',
      title: <FormattedMessage id="Schools" />,
      type: 'item',
      url: '/schools',
      icon: icons.data
    }
  ]
};

export default widget;
