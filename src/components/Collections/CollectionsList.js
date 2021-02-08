import React, { useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilValue, useRecoilState } from 'recoil';
import { collectionsState, activeCollectionState } from '../../recoil';

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
  collectionTitle: {
    margin: '10px 0',
    display: 'flex',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: 'lightblue',
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  newCollectionField: {
    margin: '16px 0 8px 0',
  },
}));

const CollectionTitle = ({ label, activeCollectionId, collectionId }) => {
  const classes = useStyles();
  const selectedStyle = activeCollectionId === collectionId ? classes.selected : '';
  return (
    <div className={classes.collectionTitle}>
      {/* <div className={classes.icon}>
        <AddIcon fontSize="inherit" />
      </div> */}
      <div className={selectedStyle}>
        <Typography variant="s4sHeader">{label}</Typography>
      </div>
    </div>
  );
};

const CollectionsList = () => {
  const classes = useStyles();
  const collectionInputRef = useRef(null);
  // const [activeCollection, setActiveCollection] = useRecoilState(collectionsState);
  const allCollections = useRecoilValue(collectionsState);
  console.info('allCollections: ', JSON.stringify(allCollections, null, '  '));
  const { collections, activeCollection } = allCollections;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="s4sHeader">Collections</Typography>
      </div>
      <div className={classes.body}>
        {Object.entries(collections).map(([collectionId, { label }]) => (
          <CollectionTitle
            key={collectionId}
            label={label}
            activeCollectionId={activeCollection}
            collectionId={collectionId}
            // handleSelect={() => setSelected(collection)}
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
          // onClick={handleAddNewCollection}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CollectionsList;
