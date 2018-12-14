import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './MedsAdministration.css';
import '../ContentPanel/ContentPanel.css';

import FhirTransform from '../../FhirTransform.js';
import { renderDisplay } from '../../fhirUtil.js';
import { stringCompare, formatDate, isValid } from '../../util.js';

//
// Display the 'Meds Administration' category if there are matching resources
//
export default class MedsAdministration extends Component {

   static propTypes = {
      data: PropTypes.array.isRequired,
      isEnabled: PropTypes.bool,
      showDate: PropTypes.bool
   }

   state = {
      matchingData: null
   }

   setMatchingData() {
      let match = FhirTransform.getPathItem(this.props.data, '[*category=Meds Administration]');
      this.setState({ matchingData: match.length > 0 ? match.sort((a, b) => stringCompare(a.data.code.coding[0].display, b.data.code.coding[0].display))
						     : null });
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
      let itemDate =  this.props.showDate && isValid(this.state, st => st.matchingData[0]) && formatDate(this.state.matchingData[0].itemDate, true, true);
      return ( this.state.matchingData &&
	       <div className={this.props.className}>
	          <div className='content-header-container'>
		     { itemDate &&
		       <div className={this.props.isEnabled ? 'content-header-date' : 'content-header-date-disabled'}>{itemDate}</div> }
		     <div className={this.props.isEnabled ? 'content-header' : 'content-header-disabled'}>Meds Administration</div>
	          </div>
	          <div className='content-body'>
		     { this.props.isEnabled && renderDisplay(this.state.matchingData, this.props.className) }
	          </div>
	       </div> );
   }
}
