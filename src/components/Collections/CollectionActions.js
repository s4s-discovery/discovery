import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: '10px',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    height: '100%',
  },
}));

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}))(Button);

const CollectionActions = ({
  showRenameField, 
  setShowRenameField, 
  handleSaveRenameCollection, 
  handleNewCollection,
  clearCurrentCollection,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowRenameCollection = () => {
    setShowRenameField(true);
    handleClose();
  };

  const handleRenameCollection = () => {
    handleClose();
    setShowRenameField(false);
    handleSaveRenameCollection();
  };

  const handleClearCollection = () => {
    handleClose();
    clearCurrentCollection()
  }

  let displayIcon;
  if (!showRenameField) {
    displayIcon = (
      <>
        <IconButton size="small" onClick={handleClick}>
          <MenuIcon color="secondary" />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          elevation={1}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={handleShowRenameCollection}>Rename</MenuItem>
          <MenuItem onClick={handleClearCollection}>Clear Collection</MenuItem>
          <MenuItem onClick={handleNewCollection}>New Collection</MenuItem>
        </Menu>
      </>
    );
  } else {
    displayIcon = (
      <StyledButton
        size="small"
        variant="contained"
        disableElevation
        color="secondary"
        className={classes.saveButton}
        onClick={handleRenameCollection}
      >
        Save
      </StyledButton>
    );
  }

  return (
    <div className={classes.root}>
      {displayIcon}
    </div>
  );
};

export default CollectionActions;
