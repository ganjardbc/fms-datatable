import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const defaultHeadCellStyles = theme => ({
  fixedBorder: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    borderTop: '0 rgba(224, 224, 224, 1) solid',
  },
});

class TableHeadBorder extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  state = {
    isSortTooltipOpen: false,
    isHintTooltipOpen: false,
  };

  render() {
    const { classes } = this.props;
    return <div className={classes.fixedBorder} />;
  }
}

export default withStyles(defaultHeadCellStyles, { name: 'MUIDataTableHeadBorder' })(TableHeadBorder);
