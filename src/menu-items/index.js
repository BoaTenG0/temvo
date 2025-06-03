// project-imports
import applications from './applications';
import widget from './widget';
import formsTables from './forms-tables';
// import chartsMap from './charts-map';
import support from './support';
// import pages from './pages';

// Function to get menu items based on user type
const getMenuItems = (userType) => {
  console.log('🚀 ~ getMenuItems ~ userType:', userType);
  if (userType === 'SUPER_ADMIN') {
    return {
      items: [widget, applications, formsTables, support]
    };
  }
  return {
    items: [widget, support]
  };
};
const menuItems = {
  items: [widget, applications, formsTables, support]
};

export default menuItems;
export { getMenuItems };
