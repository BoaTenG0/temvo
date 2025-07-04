/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project-imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import Temvo from './temvologo.svg';
import TemvoPng from './temvologo.png';
import SvgComponent from './temp';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ reverse, isIcon, sx, to }) => (
  <ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={sx}>
    {isIcon ? <SvgComponent /> : <SvgComponent />}
  </ButtonBase>
);

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
