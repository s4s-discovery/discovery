import React from 'react';
import PropTypes from 'prop-types';

import '../ContentPanel/ContentPanel.css';

import FhirTransform from '../../FhirTransform.js';
import { canonVitals, renderVitals, primaryTextValue } from '../../fhirUtil.js';
import {
  Const, stringCompare, formatKey, formatContentHeader,
} from '../../util.js';

import BaseCard from './BaseCard'
import DiscoveryContext from '../DiscoveryContext';

//
// Display the 'Vital Signs' category if there are matching resources
//
export default class VitalSigns extends React.Component {
  static catName = 'Vital Signs';

  static contextType = DiscoveryContext; // Allow the shared context to be accessed via 'this.context'

  static compareFn(a, b) {
    return stringCompare(canonVitals(VitalSigns.primaryText(a)), canonVitals(VitalSigns.primaryText(b)));
  }

  static code(elt) {
    return elt.data.code; // LOINC
  }

  static primaryText(elt) {
    //      return elt.data.code.coding[0].display;
    //      return tryWithDefault(elt, elt => VitalSigns.code(elt).coding[0].display, Const.unknownValue);
    return primaryTextValue(VitalSigns.code(elt));
  }

  static propTypes = {
    data: PropTypes.array.isRequired,
    isEnabled: PropTypes.bool,
    showDate: PropTypes.bool,
    resources: PropTypes.instanceOf(FhirTransform),
    dotClickFn: PropTypes.func,
  }

  state = {
    matchingData: null,
  }

  setMatchingData() {
    const match = FhirTransform.getPathItem(this.props.data, `[*category=${VitalSigns.catName}]`);
    this.setState({ matchingData: match.length > 0 ? match : null });
  }

  componentDidMount() {
    this.setMatchingData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setMatchingData();
    }
  }

  render() {
    const firstRes = this.state.matchingData && this.state.matchingData[0];
    return (this.state.matchingData
      && (this.props.isEnabled || this.context.trimLevel === Const.trimNone) // Don't show this category (at all) if disabled and trim set
      && (
        <BaseCard data={firstRes} showDate={this.props.showDate}>
          <div className="vital-signs category-container" id={formatKey(firstRes)}>
            { formatContentHeader(this.props.isEnabled, VitalSigns.catName, firstRes, this.context) }
            <div className="content-body">
              { this.props.isEnabled && renderVitals(this.state.matchingData, this.props.resources, this.props.dotClickFn, this.context) }
            </div>
          </div>
        </BaseCard>
      ));
  }
}
