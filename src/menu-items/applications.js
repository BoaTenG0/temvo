// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  KyberNetwork,
  Messages2,
  Calendar1,
  Kanban,
  Profile2User,
  Bill,
  UserSquare,
  ShoppingBag,
  StatusUp,
  NotificationStatus
} from 'iconsax-react';

// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  reports: StatusUp,
  transactions: NotificationStatus
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-finance',
  title: <FormattedMessage id="finance" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'transactions',
      title: <FormattedMessage id="Transactions" />,
      type: 'item',
      url: '/transactions',
      icon: icons.transactions,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: <FormattedMessage id="Reports & Analysis" />,
      type: 'item',
      url: '/reports',
      icon: icons.reports,
      breadcrumbs: false
    }

    // {
    //   id: 'kanban',
    //   title: <FormattedMessage id="kanban" />,
    //   type: 'item',
    //   icon: icons.kanban,
    //   url: '/apps/kanban/board'
    // },
    // {
    //   id: 'customer',
    //   title: <FormattedMessage id="customer" />,
    //   type: 'collapse',
    //   icon: icons.customer,
    //   children: [
    //     {
    //       id: 'customer-list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/customer/customer-list'
    //     },
    //     {
    //       id: 'customer-card',
    //       title: <FormattedMessage id="cards" />,
    //       type: 'item',
    //       url: '/apps/customer/customer-card'
    //     }
    //   ]
    // },
    // {
    //   id: 'invoice',
    //   title: <FormattedMessage id="invoice" />,
    //   url: '/apps/invoice/dashboard',
    //   type: 'collapse',
    //   icon: icons.invoice,
    //   breadcrumbs: true,
    //   children: [
    //     {
    //       id: 'create',
    //       title: <FormattedMessage id="create" />,
    //       type: 'item',
    //       url: '/apps/invoice/create'
    //     },
    //     {
    //       id: 'details',
    //       title: <FormattedMessage id="details" />,
    //       type: 'item',
    //       url: '/apps/invoice/details/1'
    //     },
    //     {
    //       id: 'list',
    //       title: <FormattedMessage id="list" />,
    //       type: 'item',
    //       url: '/apps/invoice/list'
    //     },
    //     {
    //       id: 'edit',
    //       title: <FormattedMessage id="edit" />,
    //       type: 'item',
    //       url: '/apps/invoice/edit/1'
    //     }
    //   ]
    // },
    // {
    //   id: 'profile',
    //   title: <FormattedMessage id="profile" />,
    //   type: 'collapse',
    //   icon: icons.profile,
    //   children: [
    //     {
    //       id: 'user-profile',
    //       title: <FormattedMessage id="user-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/user/personal',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'account-profile',
    //       title: <FormattedMessage id="account-profile" />,
    //       type: 'item',
    //       url: '/apps/profiles/account/basic'
    //     }
    //   ]
    // },

    // {
    //   id: 'e-commerce',
    //   title: <FormattedMessage id="e-commerce" />,
    //   type: 'collapse',
    //   icon: icons.ecommerce,
    //   children: [
    //     {
    //       id: 'products',
    //       title: <FormattedMessage id="products" />,
    //       type: 'item',
    //       url: '/apps/e-commerce/products'
    //     },
    //     {
    //       id: 'product-details',
    //       title: <FormattedMessage id="product-details" />,
    //       type: 'item',
    //       url: '/apps/e-commerce/product-details/1',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'product-list',
    //       title: <FormattedMessage id="product-list" />,
    //       type: 'item',
    //       url: '/apps/e-commerce/product-list',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'add-new-product',
    //       title: <FormattedMessage id="add-new-product" />,
    //       type: 'item',
    //       url: '/apps/e-commerce/add-new-product'
    //     },
    //     {
    //       id: 'checkout',
    //       title: <FormattedMessage id="checkout" />,
    //       type: 'item',
    //       url: '/apps/e-commerce/checkout'
    //     }
    //   ]
    // }
  ]
};

export default applications;
