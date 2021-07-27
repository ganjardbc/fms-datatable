import React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from './Popover';
import TableFilter from './TableFilter';
import TableViewCol from './TableViewCol';
import TableSearch from './TableSearch';
// import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
// import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

// BorderLinearProgress
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import UploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import FilterIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import { createCSVDownload } from '../utils';

export const defaultToolbarStyles = theme => ({
  root: {},
  margin: {
    margin: '0 0',
  },
  left: {
    flex: '0.2 1 auto',
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right',
  },
  titleRoot: {},
  titleText: {},
  subtitleText: {},
  icon: {
    padding: '8px 12px',
    maxHeight: 36,
    borderRadius: 4,
    backgroundColor: '#fff',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  },
  iconActive: {
    padding: '8px 12px',
    maxHeight: 36,
    borderRadius: 4,
    color: theme.palette.primary.main,
  },
  filterPaper: {
    maxWidth: '50%',
  },
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px',
  },
  [theme.breakpoints.down('sm')]: {
    titleRoot: {},
    titleText: {
      fontSize: '16px',
      fontWeight: '600',
    },
    subtitleText: {
      fontSize: '13px',
      fontWeight: '300',
    },
    spacer: {
      display: 'none',
    },
    left: {
      // flex: "1 1 40%",
      pcreateing: '0px 0px',
    },
    actions: {
      // flex: "1 1 60%",
      textAlign: 'right',
    },
  },
  [theme.breakpoints.down('xs')]: {
    root: {
      display: 'block',
    },
    left: {
      pcreateing: '0px 0px 0px 0px',
    },
    titleText: {
      textAlign: 'center',
    },
    subtitleText: {
      textAlign: 'center',
    },
    actions: {
      textAlign: 'center',
    },
  },
  '@media screen and (max-width: 480px)': {},
});

const ColorCircularProgress = withStyles({
  root: {
    color: '#2B9133',
  },
})(CircularProgress);

class TableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: Boolean(this.props.searchText || this.props.options.searchText || this.props.options.searchOpen),
    searchText: this.props.searchText || null,
    searchPosition: 120,
  };

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
  }

  handleUpload = () => {
    this.props.onUpload();
  };

  handleCreate = () => {
    this.props.onCreate();
  };

  handlePrint = () => {
    this.props.onPrint();
  };

  handleDownload = () => {
    this.props.onDownload();
  };

  handleCSVDownload = () => {
    const { data, displayData, columns, options } = this.props;
    let dataToDownload = data;
    let columnsToDownload = columns;

    if (options.downloadOptions && options.downloadOptions.filterOptions) {
      // check rows first:
      if (options.downloadOptions.filterOptions.useDisplayedRowsOnly) {
        dataToDownload = displayData.map((row, index) => {
          let i = -1;

          // Help to preserve sort order in custom render columns
          row.index = index;

          return {
            data: row.data.map(column => {
              i += 1;

              // if we have a custom render, which will appear as a react element, we must grab the actual value from data
              // TODO: Create a utility function for checking whether or not something is a react object
              return typeof column === 'object' && column !== null && !Array.isArray(column)
                ? data[row.index].data[i]
                : column;
            }),
          };
        });
      }

      // now, check columns:
      if (options.downloadOptions.filterOptions.useDisplayedColumnsOnly) {
        columnsToDownload = columns.filter((_, index) => _.display === 'true');

        dataToDownload = dataToDownload.map(row => {
          row.data = row.data.filter((_, index) => columns[index].display === 'true');
          return row;
        });
      }
    }
    createCSVDownload(columnsToDownload, dataToDownload, options);
  };

  setActiveIcon = iconName => {
    this.setState(
      prevState => ({
        showSearch: this.isSearchShown(iconName),
        iconActive: iconName,
        prevIconActive: prevState.iconActive,
      }),
      () => {
        const { iconActive, prevIconActive } = this.state;

        if (iconActive === 'filter') {
          this.props.setTableAction('onFilterDialogOpen');
          if (this.props.options.onFilterDialogOpen) {
            this.props.options.onFilterDialogOpen();
          }
        }
        if (iconActive === undefined && prevIconActive === 'filter') {
          this.props.setTableAction('onFilterDialogClose');
          if (this.props.options.onFilterDialogClose) {
            this.props.options.onFilterDialogClose();
          }
        }
      },
    );
  };

  isSearchShown = iconName => {
    let nextVal = false;
    if (this.state.showSearch) {
      if (this.state.searchText) {
        nextVal = true;
      } else {
        const { onSearchClose } = this.props.options;
        this.props.setTableAction('onSearchClose');
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = this.showSearch();
    }
    return nextVal;
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  showSearch = () => {
    this.props.setTableAction('onSearchOpen');
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    return true;
  };

  hideSearch = () => {
    const { onSearchClose } = this.props.options;

    this.props.setTableAction('onSearchClose');
    if (onSearchClose) onSearchClose();
    this.props.searchTextUpdate(null);

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
      searchText: null,
    }));

    this.searchButton.focus();
  };

  handleSearch = value => {
    this.setState({ searchText: value });
    !this.props.buttonSearch && this.props.searchTextUpdate(value);
  };

  handleClickSearch = value => {
    this.props.onSearch && this.props.onSearch(value);
    this.props.buttonReactiveSearch && this.props.searchTextUpdate(value);
  };

  render() {
    const {
      data,
      options,
      classes,
      columns,
      filterData,
      filterList,
      filterUpdate,
      resetFilters,
      toggleViewColumn,
      title,
      subtitle,
      tableRef,
      filterListRenderers,
      circularProgress,
    } = this.props;

    const {
      search,
      print,
      download,
      downloadCsv,
      create,
      upload,
      viewColumns,
      filterTable,
    } = options.textLabels.toolbar;
    const { showSearch, searchText } = this.state;
    var searchPosition = 120;

    return (
      <Toolbar
        className={classes.root}
        style={{ paddingLeft: '0', paddingRight: '0', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}
        role={'toolbar'}
        aria-label={'Table Toolbar'}>
        <div className={classes.left}>
          <div style={{ marginRight: 10 }}>
            <TableSearch
              buttonSearch={this.props.buttonSearch}
              onClickSearch={data => this.handleClickSearch(data)}
              searchText={searchText}
              onSearch={this.handleSearch}
              onHide={this.hideSearch}
              options={options}
            />
          </div>

          {options.viewColumns && (
            <Popover
              refExit={this.setActiveIcon.bind(null)}
              trigger={
                <Tooltip title={viewColumns} disableFocusListener>
                  <IconButton
                    data-testid={viewColumns + '-iconButton'}
                    aria-label={viewColumns}
                    classes={{ root: this.getActiveIcon(classes, 'viewcolumns') }}
                    style={{ border: '1px solid rgba(224, 224, 224, 1)', marginRight: 10 }}
                    onClick={this.setActiveIcon.bind(null, 'viewcolumns')}>
                    <Typography variant="subtitle2" style={{ marginRight: 8 }}>
                      COLUMNS
                    </Typography>
                    <ViewColumnIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
              }
            />
          )}

          {options.filter && (
            <Popover
              refExit={this.setActiveIcon.bind(null)}
              classes={{ paper: classes.filterPaper }}
              trigger={
                <Tooltip title={filterTable} disableFocusListener>
                  <IconButton
                    data-testid={filterTable + '-iconButton'}
                    aria-label={filterTable}
                    classes={{ root: this.getActiveIcon(classes, 'filter') }}
                    style={{ border: '1px solid rgba(224, 224, 224, 1)', marginRight: 10 }}
                    onClick={this.setActiveIcon.bind(null, 'filter')}>
                    <Typography variant="subtitle2" style={{ marginRight: 8 }}>
                      FILTER
                    </Typography>
                    <FilterIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableFilter
                  customFooter={options.customFilterDialogFooter}
                  columns={columns}
                  options={options}
                  filterList={filterList}
                  filterData={filterData}
                  onFilterUpdate={filterUpdate}
                  onFilterReset={resetFilters}
                />
              }
            />
          )}

          {/* <div>
            <Button size="medium" onClick={() => resetFilters()}>
              Reset 
            </Button>
          </div>

          <Typography variant="subtitle2" style={{marginRight: 8}}>0 filters applied</Typography> */}
        </div>

        {circularProgress && <ColorCircularProgress size={24} />}

        <div className={classes.actions}>
          {this.props.buttonCreate && (
            <span style={{ marginLeft: 10 }}>
              <Tooltip title={create}>
                <Button variant="contained" size="medium" color="primary" onClick={this.handleCreate}>
                  <span style={{ marginRight: 5 }}>Create</span> <AddIcon fontSize="small" />
                </Button>
              </Tooltip>
            </span>
          )}
          {options.customToolbar && options.customToolbar()}
        </div>
      </Toolbar>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbar' })(TableToolbar);
