// project-imports
import applications from './applications';
import widget from './widget';
import admin from './admin';
import formsTables from './forms-tables';
import adminTables from './admin-tables';
// import chartsMap from './charts-map';
import support from './support';
// import pages from './pages';

// Function to get menu items based on user type
const getMenuItems = (userType) => {
  if (userType === 'SUPER_ADMIN') {
    return {
      items: [widget, applications, formsTables, support]
    };
  }
  return {
    items: [admin, applications, adminTables, support]
  };
};
const menuItems = {
  items: [widget, applications, formsTables, support]
};

export default menuItems;
export { getMenuItems };
