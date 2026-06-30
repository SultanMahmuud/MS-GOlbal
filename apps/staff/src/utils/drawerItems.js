 const USER_ROLE = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  CHEF: 'chef',
  WAITER: 'waiter',
}

export const drawerItems = (role) => {
  const roleMenus = []
  const defaultMenus = [
    {
      title: 'Profile',
      path: `${role }/#`,
    },
  ]
  switch (role) {
    case USER_ROLE.ADMIN:
      roleMenus.push(
        {
          title: 'Dashboard',
          path: `${role}/adminDashboard`,
        },
        {
          title: 'Open Order',
          path: `${role}/open-order`,
        },
        {
          title: 'Category',
          path: `${role}/category`,
        },
        {
          title: 'Tables',
          path: `${role}/tables`,
        },
        {
          title: 'Sales',
          path: `${role}/sales`,
        },
        {
          title: 'Purches',
          path: `${role}/checkout`,
        },
        {
          title: 'Settings',
          path: `${role}/#`,
        },
      )
      break

    case USER_ROLE.SUPER_ADMIN:
      roleMenus.push(
        {
          title: 'Home',
          path: `${role}`,
        },
        {
          title: 'Search',
          path: `${role}/search`,
        },
        {
          title: 'Calendar',
          path: `${role}/calendar`,
        },
      )
      break

    default:
      break
  }

  return [...roleMenus, ...defaultMenus]
}

export const footerItems = [
  {
    title: 'Help Center',
    path: '#',
  },
  {
    title: 'Log Out',
    path: '#',
  },
]
