import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

// BorderLinearProgress
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import UploadIcon from '@material-ui/icons/CloudUpload';
import ReactToPrint from 'react-to-print';
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
    '&:hover': {
      color: theme.palette.primary.main,
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

class TableToolbarButton extends React.Component {
  state = {
    iconActive: null,
    searchPosition: 120,
  };

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
    const { options, classes } = this.props;

    const { print, download, downloadCsv, upload } = options.textLabels.toolbar;

    return (
      <Toolbar
        className={classes.root}
        style={{ paddingLeft: '0', paddingRight: '0', borderBottom: '0' }}
        role={'toolbar'}
        aria-label={'Table Toolbar'}>
        <div className={classes.actions}>
          {options.download && (
            <Tooltip title={downloadCsv}>
              <IconButton
                size="small"
                data-testid={downloadCsv + '-iconButton'}
                aria-label={downloadCsv}
                classes={{ root: classes.icon }}
                onClick={this.handleCSVDownload}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {options.print && (
            <span>
              <ReactToPrint
                trigger={() => (
                  <span>
                    <Tooltip title={print}>
                      <IconButton
                        size="small"
                        data-testid={print + '-iconButton'}
                        aria-label={print}
                        classes={{ root: classes.icon }}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
                content={() => this.props.tableRef()}
              />
            </span>
          )}

          {this.props.buttonPrint && (
            <span>
              <Tooltip title={print}>
                <IconButton
                  size="small"
                  data-testid={print + '-iconButton'}
                  aria-label={print}
                  classes={{ root: classes.icon }}
                  onClick={this.handlePrint}>
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          )}

          {this.props.buttonUpload && (
            <span>
              <Tooltip title={upload}>
                <IconButton
                  size="small"
                  data-testid={upload + '-iconButton'}
                  aria-label={upload}
                  classes={{ root: classes.icon }}
                  onClick={this.handleUpload}>
                  <UploadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          )}

          {this.props.buttonDownload && (
            <span>
              <Tooltip title={download}>
                <IconButton
                  size="small"
                  data-testid={download + '-iconButton'}
                  aria-label={download}
                  classes={{ root: classes.icon }}
                  onClick={this.handleDownload}>
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          )}
        </div>
      </Toolbar>
    );
  }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbarButton' })(TableToolbarButton);
