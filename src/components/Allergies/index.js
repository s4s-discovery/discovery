import React from 'react';
import PropTypes from 'prop-types';

import '../ContentPanel/ContentPanel.css';

import FhirTransform from '../../FhirTransform.js';
import { renderAllergies, primaryTextValue } from '../../fhirUtil.js';
import {
  Const, stringCompare, formatKey, formatContentHeader, tryWithDefault,
} from '../../util.js';

//
// Display the 'Allergies' category if there are matching resources
//
export default class Allergies extends React.Component {
  static catName = 'Allergies';

  static compareFn(a, b) {
    return stringCompare(Allergies.primaryText(a), Allergies.primaryText(b));
  }

  static code(elt) {
    //      if (isValid(elt, elt => elt.data.code.coding[0])) {
    //   return elt.data.code;        // SNOMED
    //      } else if (isValid(elt, elt => elt.data.substance.coding[0])) {
    //   return elt.data.substance;      // NDFRT
    //      }
    return tryWithDefault(elt, (elt) => elt.data.substance, tryWithDefault(elt, (elt) => elt.data.code, null));
  }

  static primaryText(elt) {
    //      return elt.data.code.coding[0].display;
    //      return tryWithDefault(elt, elt => Allergies.code(elt).coding[0].display, Const.unknownValue);
    return primaryTextValue(Allergies.code(elt));
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    isEnabled: PropTypes.bool,
    showDate: PropTypes.bool,
  }

  state = {
    matchingData: null,
  }

  setMatchingData() {
    const match = FhirTransform.getPathItem(this.props.data, `[*category=${Allergies.catName}]`);
    this.setState({
      matchingData: match.length > 0 ? match.sort(Allergies.compareFn)
        : null,
    });
  }

  componentDidMount() {
    this.setMatchingData();
  }

  componentDidUpdate(prevProps, _prevState) {
    if (prevProps.data !== this.props.data) {
      this.setMatchingData();
    }
  }

  render() {
    const firstRes = this.state.matchingData && this.state.matchingData[0];
    const {
      patient, providers, trimLevel,
    } = this.props;
    return (this.state.matchingData
      && (this.props.isEnabled || trimLevel === Const.trimNone) // Don't show this category (at all) if disabled and trim set
      && (
        <div className="allergies category-container" id={formatKey(firstRes)}>
          { formatContentHeader(this.props.isEnabled, Allergies.catName, firstRes, { patient, trimLevel }) }
          <div className="content-body">
            { this.props.isEnabled && renderAllergies(this.state.matchingData, providers) }
          </div>
        </div>
      ));
  }
}
