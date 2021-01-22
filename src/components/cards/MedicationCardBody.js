import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CardBodyField from './CardBodyField'
import { formatDate } from './GenericCardBody'

const useStyles = makeStyles((theme) => ({
  highlight: {
    backgroundColor: '#d78c14', // add this color to theme
  }
}));

const MedicationCardBody = ({fieldsData}) => {
  const classes = useStyles()

  function formatDosageInstruction() {
    if ( 
        fieldsData.dosageInstruction 
        && fieldsData.dosageInstruction.timing 
        && fieldsData.dosageInstruction.timing.repeat
      ) {
      const asNeededText = fieldsData.dosageInstruction.asNeededBoolean ? "as needed" : "as instructed" //what the opposite of As Needed?
      const frequency = fieldsData.dosageInstruction.timing.repeat.frequency
      const period = fieldsData.dosageInstruction.timing.repeat.period
      const periodUnit = fieldsData.dosageInstruction.timing.repeat.periodUnit
      return `${frequency} every ${period} ${periodUnit} ${asNeededText}` // need dynamic translation for
    }
    return null
  }

  function formatDosageStart() {
    if ( 
        fieldsData.dosageInstruction 
        && fieldsData.dosageInstruction.timing 
        && fieldsData.dosageInstruction.timing.repeat
        && fieldsData.dosageInstruction.timing.repeat.boundsPeriod
      ) {
      return formatDate(fieldsData.dosageInstruction.timing.repeat.boundsPeriod)
    }
    
    return null
  }

  return (
    <>
      <CardBodyField 
        dependency={fieldsData.medicationDisplay} 
        label="MEDICATIONS" 
        value={fieldsData.medicationDisplay} 
        highlight
      />
      <CardBodyField 
        dependency={fieldsData.reason} 
        label="REASON" 
        value={fieldsData.reason} 
      />
      <CardBodyField 
        dependency={fieldsData.onsetDateTime} 
        label="ONSET" 
        value={formatDate(fieldsData.onsetDateTime)} 
      />
      <CardBodyField 
        dependency={fieldsData.abatement} 
        label="ABATEMENT" 
        value={formatDate(fieldsData.abatement)} 
      />
      <CardBodyField 
        dependency={fieldsData.asserted} 
        label="ASSERTED" 
        value={formatDate(fieldsData.asserted)} 
      />
      <CardBodyField 
        dependency={fieldsData.provider} 
        label="PROVIDER" 
        value={fieldsData.provider} 
      />
      <CardBodyField 
        dependency={fieldsData.status} 
        label="STATUS" 
        value={fieldsData.status} 
      />
      {/* note sure where to find quantity, patient 3001 doesnt have med req supply */}
      <CardBodyField 
        dependency={fieldsData.quantity} 
        label="QUANTITY" 
        value={'TBD'} 
      />
      {/* note sure where to find supply, patient 3001 doesnt have med req supply */}
      <CardBodyField 
        dependency={fieldsData.supply} 
        label="SUPPLY" 
        value={'TBD'} 
      />
      <CardBodyField 
        dependency={fieldsData.dosageInstruction && fieldsData.dosageInstruction.timing} 
        label="DOSAGE" 
        value={formatDosageInstruction()} 
      />
      <CardBodyField 
        dependency={fieldsData.dosageInstruction && fieldsData.dosageInstruction.timing && fieldsData.dosageInstruction.timing.repeat && fieldsData.dosageInstruction.timing.repeat.boundsPeriod} 
        label="STARTING ON" 
        value={formatDosageStart()} 
      />
      <CardBodyField 
        dependency={fieldsData.dispenseRequest} 
        label="REFILLS" 
        value={fieldsData.dispenseRequest && fieldsData.dispenseRequest.numberOfRepeatsAllowed} 
      />
    </>
  )
}

export default MedicationCardBody