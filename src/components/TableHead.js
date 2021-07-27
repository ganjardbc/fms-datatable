import { withStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React from 'react';
import { findDOMNode } from 'react-dom';
import TableHeadCell from './TableHeadCell';
import TableHeadRow from './TableHeadRow';
import TableSelectCell from './TableSelectCell';
import TableHeadBorder from './TableHeadBorder';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
    display: 'table-cell',
    padding: '4px 56px 4px 24px',
    textAlign: 'right',
    verticalAlign: 'inherit',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  noBorder: {
    width: '100%',
  },
});

class TableHead extends React.Component {
  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate('head', null);
  };

  render() {
    const { classes, columns, count, options, data, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <MuiTableHead
        // style={{ borderTop: '1px rgba(224, 224, 224, 1) solid' }}
        className={classNames({ [classes.responsiveStacked]: options.responsive === 'stacked', [classes.main]: true })}>
        <TableHeadRow>
          <TableSelectCell
            ref={el => setCellRef(0, findDOMNode(el))}
            onChange={this.handleRowSelect.bind(null)}
            indeterminate={isDeterminate}
            checked={isChecked}
            isHeaderCell={true}
            expandableOn={options.expandableRows}
            selectableOn={options.selectableRows}
            fixedHeader={options.fixedHeader}
            selectableRowsHeader={options.selectableRowsHeader}
            isRowSelectable={true}
            borderTop={true}
          />
          {columns.map(
            (column, index) =>
              column.display === 'true' &&
              (column.customHeadRender ? (
                <th className={classes.fixedHeader}>
                  <TableHeadBorder />
                  {column.customHeadRender({ index, ...column }, this.handleToggleColumn)}
                </th>
              ) : (
                <TableHeadCell
                  key={index}
                  index={index}
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  print={column.print}
                  options={options}
                  column={column}>
                  {column.label}
                </TableHeadCell>
              )),
          )}
        </TableHeadRow>
      </MuiTableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: 'MUIDataTableHead' })(TableHead);
