import React from 'react';

import './components/ContentPanel/ContentPanel.css';

export function getStyle(oElm, css3Prop){
      try {
	 if (window.getComputedStyle){
	    return getComputedStyle(oElm).getPropertyValue(css3Prop);
	 } else if (oElm.currentStyle){
	    return oElm.currentStyle[css3Prop];
	 }
      } catch (e) {
      	 return '';
      }
   }

export function stringCompare(a, b) {
   const aLower = a.toLowerCase();
   const bLower = b.toLowerCase();
   if (aLower === bLower) {
      return 0;
   } else if (aLower < bLower) {
      return -1;
   } else { // aLower > bLower
      return 1;
   }
}

// Do arrays have the same contents, checking for element-by-element strict equality
export function shallowEqArray(arr1, arr2) {
   if (arr1.length !== arr2.length) {
      return false;
   } else {
      for (let i = 0; i < arr1.length; i++) {
	 if (arr1[i] !== arr2[i]) {
	    return false;
	 }
      }
      return true;
   }
}



export function formatTime(date) {
   let strDate = date+'';
   const tLoc = strDate.indexOf('T');
   if (tLoc === -1) {
      // No time
      return '';
   } else {
      return new Date(strDate).toLocaleTimeString('en-US', {timeZone:'UTC', timeZoneName:'short'})
			      .replace('UTC','GMT').replace(' PM', 'pm').replace(' AM', 'am');
   }
}

export function formatDate(date, fillShortDates, surpressTime) {
   let strDate = date+'';

   if (fillShortDates) {
      strDate = strDate.length === 4 ? strDate += '-01' : strDate;
      strDate = strDate.length === 7 ? strDate += '-01' : strDate;
   }

   const tLoc = strDate.indexOf('T');
   if (tLoc === -1) {
      // No time
      return strDate;
   } else {
      // Time is present
      const datePart = strDate.substring(0,tLoc);
      if (surpressTime) {
	 return datePart;
      } else {
	 return datePart + '\u00a0\u00a0' + formatTime(date);
      }
   }
}

export function formatAge(birthDate, ageDate, prefix) {
      let DAY_MS = 24 * 60 * 60 * 1000;
      let MAX_ONLY_DAYS = 21;     // Max age to show just as "days"
      let MAX_ONLY_WEEKS = 10;    // Max age to show just as "weeks"
      let DAYS_PER_WEEK = 7;
      let AVG_DAYS_PER_MONTH = 30.4;

      let startDate = new Date(birthDate);
      let endDate = new Date(ageDate);

      if (endDate < startDate) {
	 return 'ALERT: Date is prior to birth';

      } else if (endDate - startDate < DAY_MS) {
	 return 'birth date';

      } else {
	 let diffDate = new Date(endDate - startDate);
	 let years = diffDate.toISOString().slice(0,4) - 1970;
	 let months = diffDate.getMonth();
	 let days = diffDate.getDate();
	 let weeks = Math.floor((months * AVG_DAYS_PER_MONTH + days) / DAYS_PER_WEEK);

	 if (years === 0 && months === 0 && days <= MAX_ONLY_DAYS) {
	    return prefix + days + (days === 1 ? ' day' : ' days');

	 } else if (years === 0 && weeks <= MAX_ONLY_WEEKS) {
	    return prefix + weeks + ' weeks';

	 } else {
	    return prefix + (years > 0 ? years + 'yr' : '') + (years > 0 && months > 0 ? ' ' : '') + (months > 0 ? months + 'mo' : '');
	 }
      }
   }

export function formatContentHeader(isEnabled, category, itemDate, appContext) {
   let dateOnly = formatDate(itemDate, true, true);
   let dateWithTime = formatDate(itemDate, true, false);
   let dob = appContext.resources.pathItem('[category=Patient].data.birthDate');
   let age = formatAge(dob, itemDate, 'age ');

   return (
      <div className={isEnabled ? 'content-header-container' : 'content-header-container-disabled'} id={dateOnly}>
	 <div className={isEnabled ? 'content-header' : 'content-header-disabled'}>{category}</div>
	   <div className={isEnabled ? 'content-header-date' : 'content-header-date-disabled'}>{dateWithTime}</div>
	   <div className={isEnabled ? 'content-header-age' : 'content-header-age-disabled'}>|&nbsp; {age}</div>
	 <div className='content-header-padding'/>
      </div>
   );
}

export function formatDPs(number, places) {
   const mult = Math.pow(10, places);
   return parseFloat(Math.round(number * mult) / mult).toFixed(places);
}

// Is accessor(data) defined?
export function isValid(data, accessor) {
   try {
      return accessor(data) !== undefined;
   } catch (e) {
      return false;
   }
}

// If accessor(data) is defined return accessor(data) else return defaultVal
export function tryWithDefault(data, accessor, defaultVal) {
   try {
      let accessorVal = accessor(data);
      if (accessorVal === undefined) {
	 return defaultVal;
      } else {
	 return accessorVal;
      }
   } catch (e) {
      return defaultVal;
   }
}
	

// Acronyms that should be displayed all uppercase
const acronyms = ['Bmi'];

// Words that should be displayed all lowercase
const minorWords = ['A', 'An', 'And', 'As', 'At', 'But', 'By', 'For', 'From', 'In',
		  'Into', 'Near', 'Nor', 'Of', 'On', 'Onto', 'Or', 'The', 'To', 'With']; 

export function titleCase(str) {
   let finalWords = [];
   let words = str.toLowerCase().split(' ').map(word => word.replace(word[0], word[0].toUpperCase()));

   for (let index = 0; index < words.length; index++) {
      let word = words[index];
      if (acronyms.indexOf(word) >= 0) {
	   // Uppercase acronyms
	   finalWords.push(word.toUpperCase());
       } else if (minorWords.indexOf(word) >= 0 && index > 0) {
	   // Lowercase minor words, unless first
	   finalWords.push(word.toLowerCase());
       } else {
	   // Title case everything else
	   finalWords.push(word);
       }
   }

   return finalWords.join(' ');
}

export function numericPart(val) {
   const index = val.toString().search(/[A-Za-z%]/);
   return parseFloat(val.toString().substring(0,index));
}

export function unitPart(val) {
   const index = val.toString().search(/[A-Za-z%]/);
   return val.toString().substring(index);
}

//
// Concatenate n arrays, skipping null elements
//
export function combine() {
   let res = [];
   for (let i = 0; i < arguments.length; i++) {
      if (arguments[i]) {
	 res = res.concat(arguments[i]);
      }
   }
   return res;
}

// Remove nulls and duplicates from dateArray, then sort in ascending order
export function cleanDates(dateArray) {
   return dateArray.filter((value, index) => value !== null && dateArray.indexOf(value) === index)
		   .sort((a, b) => new Date(b) - new Date(a)).reverse();
}

// Normalize an array of dates by comparing elements to 'min' (returning 0.0) and 'max' (returning 1.0)
//   (if min == max then return 0.5)
export function normalizeDates(elts, minDate, maxDate) {
   let min = (minDate instanceof Date) ? minDate : new Date(minDate);
   let max = (maxDate instanceof Date) ? maxDate : new Date(maxDate);
   let delta = max - min;
   return elts.map( elt => (delta === 0) ? 0.5 : (((elt instanceof Date) ? elt : new Date(elt)) - min) / delta);
}

// Determine the increment/skip factor (in years) for timeline tickmarks
//   (dates are in ISO format)
export function timelineIncrYears(minDate, maxDate, maxSinglePeriods) {
   const firstYear = new Date(formatDate(minDate, true, true)).getUTCFullYear();
   const lastYear = new Date(formatDate(maxDate, true, true)).getUTCFullYear();
   const incr = Math.max(1, Math.ceil((lastYear-firstYear+1)/maxSinglePeriods));

   return incr;
}

// Check whether a date (string or Date object) is within a date range (strings or Date objects)
export function inDateRange(date, rangeLow, rangeHigh) {
   let dateStr = (date instanceof Date ? date : new Date(date)).toISOString().substring(0,10);
   let rangeLowStr = (rangeLow instanceof Date ? rangeLow : new Date(rangeLow)).toISOString().substring(0,10);
   let rangeHighStr = (rangeHigh instanceof Date ? rangeHigh : new Date(rangeHigh)).toISOString().substring(0,10);

   return dateStr >= rangeLowStr && dateStr <= rangeHighStr;
}

// document.querySelector with check
export function checkQuerySelector(sel) {
   let elt = document.querySelector(sel);
   if (elt) {
      return elt;
   } else {
      console.log('checkQuerySelector -- cannot find: ' + sel);
//      debugger;
   }
}

//
// Return elements of 'arr' that are unique according to 'keyFn'
//
export function uniqueBy(arr, keyFn) {
   let seen = {};
   return arr.filter( (elt, index) => {
      try { 
	 let key = keyFn(elt);
	 return seen.hasOwnProperty(key) ? false : seen[key] = true;
      } catch (e) {
	 return false;
      }
   });
}

//
// Log differences between two data structures ('was', 'now') to the console
//
export function logDiffs(label, was, now) {
   switch (typeof was) {
      case 'object':
	 if (was instanceof Array) {
	    // An array
	    console.group(label);
	       for (let i = 0; i < was.length; i++) {
		  if (JSON.stringify(was[i]) !== JSON.stringify(now[i])) {
		     // Element changed
		     logDiffs(`[${i}]`, was[i], now[i]);
		  }
	       }
	    console.groupEnd();
	 } else if (was === null) {
	    // null
	    if (JSON.stringify(was) !== JSON.stringify(now)) {
	       // Changed
	       console.log(`${label}: ${was} --> ${now}`);
	    }
	 } else {
	    // An object
	    console.group(label);
	       for (let attr in was) {
		  if (now && now.hasOwnProperty(attr)) {
		     // Property present in both objects
		     if (JSON.stringify(was[attr]) !== JSON.stringify(now[attr])){
			// Property changed
			logDiffs(`.${attr}`, was[attr], now[attr]);
		     }
		  } else {
		     // Only in 'was'
		     console.log(`.${attr} --> undefined`);
		  } 
	       }
	    console.groupEnd();
	 }
         break;

      case 'function':
	 if (was !== now) {
	    // Function changed
	    console.log(`Function ${label} changed.`);
	 }
	 break;

      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
	 if (was !== now) {
	    console.log(`${label}: ${was} --> ${now}`);
	 }
         break;

      default:
	 break;
   }

   // Log object props only present in 'now'
   if (typeof now === 'object' && now !== null && !(now instanceof Array)) {
      console.group(label);
	 for (let attr in now) {
	    if (now.hasOwnProperty(attr)) {
	       if (was && was.hasOwnProperty(attr)) {
		  // Present in 'was' or both -- already reported
	       } else {
		  // Only in 'now'
		  console.log(`.${attr} not previously set`); 
	       }
	    }
	 }
      console.groupEnd();
   }
}
