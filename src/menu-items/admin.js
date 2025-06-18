// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart, PasswordCheck, CpuCharge, Home, People, UserMinus, UserAdd } from 'iconsax-react';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart,
  pos: PasswordCheck,
  cpu: CpuCharge,
  home: Home,
  people: People,
  user: UserMinus,
  user2: UserAdd
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget = {
  id: 'group-admin',
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
    // {
    //   id: 'nfc',
    //   title: <FormattedMessage id="NFC Wristbands" />,
    //   type: 'item',
    //   url: '/nfc-wristbands',
    //   icon: icons.cpu
    // },
    {
      id: 'pos',
      title: <FormattedMessage id="POS Management" />,
      type: 'item',
      url: '/pos-management',
      icon: icons.pos
    },
    {
      id: 'students',
      title: <FormattedMessage id="Students" />,
      type: 'item',
      url: '/students',
      icon: icons.people,
      breadcrumbs: true
    },
    {
      id: 'vendors',
      title: <FormattedMessage id="Vendors" />,
      type: 'item',
      url: '/vendors',
      icon: icons.user,
      breadcrumbs: false
    },
    {
      id: 'parents',
      title: <FormattedMessage id="Parents" />,
      type: 'item',
      url: '/parents',
      icon: icons.user2,
      breadcrumbs: false
    }
  ]
};

export default widget;
