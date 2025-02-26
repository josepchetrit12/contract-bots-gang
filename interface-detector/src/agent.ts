import {
  Finding,
  FindingSeverity,
  FindingType,
  Initialize,
  HandleAlert,
  AlertEvent,
} from "forta-agent";

import {
  condensateResults,
  parseData
} from './utils'

import {
  isItOwnable,
  isItERC20,
  isItERC721,
  isItAccessControl,
  isItProxy,
  isItUUPS,
  isItERC1967,
  isItProxyAdmin,
  isItTransparentUpgradeableProxyPattern,
  isItInitializable
} from './inspectors'

const analyzeInterface = (events: any[], functions: any[]) => {
  var parsedData = parseData(events, functions);
  var observationResults: any[] = [];

  var {result, functionmatches, eventmatches} = isItOwnable(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)
  
  observationResults.push(
    {
      type: 'Ownable', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItERC20(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'ERC20', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItERC721(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'ERC721', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItAccessControl(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'AccessControl', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItProxy(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'Proxy', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItUUPS(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'UUPS', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItERC1967(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'ERC1967', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItTransparentUpgradeableProxyPattern(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'TransparentProxyPattern', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, eventmatches} = isItProxyAdmin(parsedData.eventsGroupedByHex, parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'ProxyAdmin', 
      status: result, 
      fmatches: functionmatches, 
      ematches: eventmatches,
      extras: {}
    }
  );

  var {result, functionmatches, } = isItInitializable(parsedData.functionsGroupedByHex)

  observationResults.push(
    {
      type: 'Initializable', 
      status: result, 
      fmatches: functionmatches, 
      ematches: null,
      extras: {}
    }
  );

  return observationResults;
}

const initialize: Initialize = async () => {
  // do some initialization on startup e.g. fetch data
  return {
    'alertConfig': {
        'subscriptions': [
            {
                'botId': '0x9703bb3bf08bc89e6d0fd273fa995c32f75e8998c314bafdafcfe2491678f083',
                'alertId': 'CD'
            }
        ]
    }
  }
}

const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
  const findings: Finding[] = [];
  
  const alert = alertEvent.alert;

  var knownFunctions = JSON.parse(alert.metadata.functions);

  var knownEvents = JSON.parse(alert.metadata.events);

  var results = analyzeInterface(knownEvents, knownFunctions);

  //Condensate results
  var condensatedResults: any = condensateResults(results);

  if(condensatedResults.types.length == 0) return findings;

  var confidence: number = 0;

  condensatedResults.fmatches.forEach((match: { confidence: number; }) => {
    confidence += match.confidence;
  })

  condensatedResults.ematches.forEach((match: { confidence: number; }) => {
    confidence += match.confidence;
  })

  confidence /= (condensatedResults.fmatches.length + condensatedResults.ematches.length);

  findings.push(
    Finding.fromObject({
      name: `Interface detected`,
      description: `${alert.metadata.contractAddress.substring(0,10)} adheres to ${JSON.stringify(condensatedResults.types)}`,
      alertId: `ID`,
      severity: FindingSeverity.Info,
      type: FindingType.Info,
      metadata: {
        types: JSON.stringify(condensatedResults.types),
        contractAddress: alert.metadata.contractAddress,
        fmatches: JSON.stringify(condensatedResults.fmatches),
        ematches: JSON.stringify(condensatedResults.ematches),
        overallConfidence: `${confidence}%`,
        extras: JSON.stringify(condensatedResults.extras)
      },
    })
  );

  return findings;
}

export default {
  initialize,
  handleAlert
};
