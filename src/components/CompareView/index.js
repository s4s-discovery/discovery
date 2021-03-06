import React from 'react';
import { useRecoilValue } from 'recoil';
import { Typography } from '@material-ui/core';

import './CompareView.css';
import SelectedCardCollection from '../SelectedCardCollection';
import RecordSelector from '../SelectedCardCollection/RecordSelector';
import NoResultsDisplay from '../NoResultsDisplay';
import Sparkline from '../Sparkline';
import {
  activeCategoriesState,
  activeProvidersState,
  timeFiltersState,
  filteredActiveCollectionState,
  resourcesState,
} from '../../recoil';
import { titleCase, inDateRange } from '../../util.js';

const formatYearRange = (minDate, maxDate, pre, post) => {
  const minYear = `${minDate.getFullYear()}`;
  const maxYear = `${maxDate.getFullYear()}`;

  return minYear === maxYear ? pre + minYear + post : `${pre + minYear} \u2013 ${maxYear}${post}`;
};

const ProviderSparkLine = ({
  providerLabel, uuids, records, minDate, maxDate,
}) => {
  const dates = uuids.reduce((acc, uuid) => {
    const r = records[uuid];
    if (r.provider === providerLabel) {
      if (inDateRange(r.itemDate, minDate, maxDate)) {
        acc.push(new Date(r.itemDate));
      }
    }
    return acc;
  }, []);
  if (dates.length) {
    return (
      <div className="compare-view-data-row">
        <Sparkline
          className="compare-view-sparkline"
          minDate={minDate}
          maxDate={maxDate}
          dates={dates}
        />
        <div className="compare-view-provider">
          { titleCase(providerLabel) + formatYearRange(minDate, maxDate, ' [', ']') }
        </div>
      </div>
    );
  }

  return null;
};

const CompareView = () => {
  const filteredActiveCollection = useRecoilValue(filteredActiveCollectionState);
  const activeCategories = useRecoilValue(activeCategoriesState);
  const activeProviders = useRecoilValue(activeProvidersState);
  const { dateRangeStart, dateRangeEnd } = useRecoilValue(timeFiltersState);
  const { records } = useRecoilValue(resourcesState);

  const { filteredRecordCount } = filteredActiveCollection;
  const providerLabels = Object.keys(activeProviders);
  const minDate = new Date(dateRangeStart);
  const maxDate = new Date(dateRangeEnd);

  const itemsForCategories = Object.entries(filteredActiveCollection)
    .sort(([categoryLabel1], [categoryLabel2]) => ((categoryLabel1 < categoryLabel2) ? -1 : 1))
    .reduce((acc, [categoryLabel, category]) => {
      if (category?.filteredRecordCount) {
        acc.push(
          <div className="compare-view-category-container" key={categoryLabel}>
            <div className="compare-view-title-container">
              <div className="compare-view-title">
                {categoryLabel}
                {/* <button className={this.buttonClass(categoryLabel)} onClick={() => this.handleSetClearButtonClick(categoryLabel)} /> */}
              </div>
            </div>
            { Object.entries(category.subtypes)
              .sort(([subtype1], [subtype2]) => ((subtype1 < subtype2) ? -1 : 1))
              .reduce((acc, [displayCoding, { uuids, _collectionUuids }]) => {
                if (uuids.length) {
                  // uuids from filteredActiveCollection are a sortable Array:
                  acc.push(
                    <div
                      key={displayCoding}
                      className="compare-view-unique-item-container"
                    >
                      <RecordSelector
                        label={displayCoding}
                        uuids={uuids}
                      />
                      <div
                        className="compare-view-data-column"
                      >
                        {providerLabels.map((providerLabel) => (
                          <ProviderSparkLine
                            key={providerLabel}
                            providerLabel={providerLabel}
                            uuids={uuids}
                            records={records}
                            minDate={minDate}
                            maxDate={maxDate}
                          />
                        ))}
                      </div>
                    </div>,
                  );
                }
                return acc;
              }, []) }
          </div>,
        );
      }
      return acc;
    }, []);

  return (
    <div className="compare-view">
      <div className="compare-view-header">
        <Typography variant="s4sHeader">
          Record Selector
        </Typography>
      </div>
      <div className="compare-view-scroller">
        <div className="compare-view-all-unique-items">
          { itemsForCategories }
          <NoResultsDisplay
            filteredRecordCount={filteredRecordCount}
            activeCategories={activeCategories}
            activeProviders={activeProviders}
          />
        </div>
      </div>
      <SelectedCardCollection />
    </div>
  );
};

export default CompareView;
