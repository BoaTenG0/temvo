/* eslint-disable no-unused-vars */
import { useEffect, useLayoutEffect, useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, useMediaQuery } from '@mui/material';

// project-imports
import NavGroup from './NavGroup';
import { getMenuItems } from 'menu-items';
import { Menu } from 'menu-items/dashboard';

import { useSelector } from 'store';
import useConfig from 'hooks/useConfig';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { MenuOrientation } from 'config';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const userInfo = useSelector((state) => state.user.userInfo);

  // Get menu items based on user type - memoized to prevent infinite re-renders
  const menuItem = useMemo(() => getMenuItems(userInfo?.userType), [userInfo?.userType]);

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });

  //   useEffect(() => {
  //     handlerMenuItem();
  //     // eslint-disable-next-line
  //   }, []);

  useEffect(() => {
    setMenuItems(menuItem);
    // eslint-disable-next-line
  }, [menuItem]);

  //   let getMenu = Menu();
  //   console.log("🚀 ~ Navigation ~ getMenu:", getMenu)
  //   const handlerMenuItem = () => {
  //     const isFound = menuItem.items.some((element) => {
  //       if (element.id === 'group-dashboard') {
  //         return true;
  //       }
  //       return false;
  //     });

  //     if (getMenu?.id !== undefined && !isFound) {
  //       menuItem.items.splice(0, 0, getMenu);
  //       setMenuItems([]);
  //     }
  //   };

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems?.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems?.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems?.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
  }

  const navGroups = menuItems?.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
