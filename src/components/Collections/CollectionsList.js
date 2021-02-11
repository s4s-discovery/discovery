/* eslint-disable react/jsx-filename-extension */
import React, { useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilState } from 'recoil';
import { allCollectionsState } from '../../recoil';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '750px',
    borderRadius: '10px',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: '5px',
  },
  body: {
    padding: '20px',
  },
  collectionSelector: {
    margin: '10px 0',
    padding: '8px',
    display: 'flex',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: 'lightblue',
  },
  newCollectionField: {
    margin: '16px 0 8px 0',
  },
  renameCollectionField: {
    margin: '16px 0 8px 0',
  },
}));

const CollectionTitle = ({
  label, activeCollectionId, collectionId, handleSelect,
}) => {
  const classes = useStyles();
  const isActiveCollection = (activeCollectionId === collectionId);
  const selectedStyle = isActiveCollection ? classes.selected : '';
  const [renamingCollection, setRenamingCollection] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [allCollections, setAllCollections] = useRecoilState(allCollectionsState);

  const renameInput = useRef(null);

  const handleSaveRenameCollection = () => {
    setAllCollections((previousState) => {
      const { collections } = previousState;
      return {
        activeCollectionId,
        collections: {
          ...collections,
          [activeCollectionId]: {
            label: renameInput.current.value,
            uuids: collections[activeCollectionId].uuids,
          },
        },
      };
    });
  };

  const handleRenameCollection = () => {
    handleSaveRenameCollection();
    setRenamingCollection(false);
  };

  let collectionView;
  if (!renamingCollection) {
    collectionView = (
      <Grid container>
        <Grid item container alignItems="center">
          <Grid item xs={8}>
            <MenuItem
              className={`${classes.collectionSelector} ${selectedStyle}`}
              onClick={handleSelect}
            >
              <Typography variant="s4sHeader">{label}</Typography>
            </MenuItem>
          </Grid>
          <Grid item container xs={4}>
            <Grid item container justifyContent="flex-end">
              {isActiveCollection
        && (
          <Button onClick={() => setRenamingCollection(true)}>
            RENAME
          </Button>
        )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {
    collectionView = (
      <>
        <TextField
          size="small"
          fullWidth
          inputRef={renameInput}
          defaultValue={label}
        />
        <Button
          variant="contained"
          color="primary"
          disableElevation
          size="small"
          onClick={handleRenameCollection}
          className={classes.newCollectionField}
        >
          Save
        </Button>
      </>
    );
  }

  return (
    <>
      { collectionView }
    </>
  );
};

const CollectionsList = () => {
  const classes = useStyles();
  const collectionInputRef = useRef(null);
  const [allCollections, setAllCollections] = useRecoilState(allCollectionsState);
  const setActiveCollection = (collectionId) => {
    setAllCollections((previousState) => {
      const { collections } = previousState;
      return {
        activeCollectionId: collectionId,
        collections,
      };
    });
  };

  const handleAddNewCollection = () => {
    const newCollectionLabel = collectionInputRef?.current?.value;
    if (newCollectionLabel) {
      setAllCollections((previousState) => {
        const nowUTC = (new Date()).toISOString();
        return {
          activeCollectionId: previousState.activeCollectionId,
          collections: {
            ...previousState.collections,
            [nowUTC]: {
              label: newCollectionLabel,
              uuids: [],
            },
          },
        };
      });
      collectionInputRef.current.value = '';
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="s4sHeader">Collections</Typography>
      </div>
      <div className={classes.body}>
        {Object.entries(allCollections.collections).map(([collectionId, { label }]) => (
          <CollectionTitle
            key={collectionId}
            label={label}
            activeCollectionId={allCollections.activeCollectionId}
            collectionId={collectionId}
            handleSelect={() => setActiveCollection(collectionId)}
          />
        ))}
        <div className={classes.newCollectionField}>
          <TextField
            placeholder="New Collection"
            size="small"
            inputRef={collectionInputRef}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          size="small"
          onClick={handleAddNewCollection}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default React.memo(CollectionsList);
