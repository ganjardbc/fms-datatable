import React from 'react';
import Grow from '@material-ui/core/Grow';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';

const defaultSearchStyles = theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
    border: '1px solid rgba(224, 224, 224, 1)',
    maxHeight: 34,
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 10
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginTop: '10px',
    marginRight: '0',
  },
  searchText: {
    flex: '1 0',
    borderBottom: '0 #fff solid',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
  icon: {
    padding: '8px 12px',
    maxHeight: 36,
    borderRadius: 0,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
});

class TableSearch extends React.Component {
  handleTextChange = event => {
    this.props.onSearch(event.target.value);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = event => {
    if (event.keyCode === 27 || event.keyCode === 13) {
      // this.props.onHide();
      this.props.onClickSearch(this.props.searchText);
    }
  };

  render() {
    const { classes, options, onHide, searchText, onClickSearch, buttonSearch } = this.props;

    return (
      <Grow appear in={true} timeout={300}>
        {buttonSearch ? (
          <div className={classes.main} ref={el => (this.rootRef = el)}>
            <TextField
              className={classes.searchText}
              style={{ marginTop: 2 }}
              autoFocus={false}
              InputProps={{
                'data-test-id': options.textLabels.toolbar.search,
                'aria-label': options.textLabels.toolbar.search,
                disableUnderline: true
              }}
              value={searchText || ''}
              onChange={this.handleTextChange}
              fullWidth={true}
              inputRef={el => (this.searchField = el)}
              placeholder={options.searchPlaceholder ? options.searchPlaceholder : 'Search ..'}
            />
            {searchText ? (
              <IconButton className={classes.icon} onClick={onHide}>
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton className={classes.icon} onClick={() => {
                searchText ? onClickSearch(searchText) : this.searchField.focus();
              }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ) : (
          <div className={classes.main} ref={el => (this.rootRef = el)}>
            {/* <SearchIcon style={{ marginRight: '10px' }} className={classes.searchIcon} /> */}
            <TextField
              className={classes.searchText}
              style={{ marginTop: 2 }}
              autoFocus={true}
              InputProps={{
                'data-test-id': options.textLabels.toolbar.search,
                'aria-label': options.textLabels.toolbar.search,
                disableUnderline: true
              }}
              value={searchText || ''}
              onChange={this.handleTextChange}
              fullWidth={true}
              inputRef={el => (this.searchField = el)}
              placeholder={options.searchPlaceholder ? options.searchPlaceholder : 'Search ..'}
            />
            <IconButton className={classes.icon} onClick={onHide}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </Grow>
    );
  }
}

export default withStyles(defaultSearchStyles, { name: 'MUIDataTableSearch' })(TableSearch);
