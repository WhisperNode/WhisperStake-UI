import _ from 'lodash'
import React from 'react';
import { round, add, multiply } from 'mathjs'

import ValidatorLink from './ValidatorLink'
import Coins from './Coins'
import TooltipIcon from './TooltipIcon'

import {
  Table,
} from 'react-bootstrap'

import {
  XCircle,
  HeartPulse
} from 'react-bootstrap-icons'
import ValidatorServices from './ValidatorServices';
import ValidatorNetworks from './ValidatorNetworks';
import OperatorLastRestake from './OperatorLastRestake';
import Address from './Address';
import ValidatorStatus from './ValidatorStatus'
import SkipIcon from '../assets/skip.svg'
import SkipWhiteIcon from '../assets/skip-white.svg'

function ValidatorProfile(props) {
  const { validator, operator, network, networks, registryData, lastExec } = props

  const minimumReward = () => {
    return {
      amount: operator.minimumReward,
      denom: network.denom
    }
  }

  function uptime() {
    if(!validator.uptime) return

    const period = validator.uptime_periods.slice(-1)[0]
    const blockPeriod = validator.missed_blocks_periods.slice(-1)[0]
    const uptime = <span>{_.round(period.uptime * 100, 2)}% <small>(missed {blockPeriod.missed.toLocaleString()} of {blockPeriod.blocks.toLocaleString()} blocks)</small></span>
    if(!validator.slashes) return uptime

    const slashes = <small>{validator.slashes.length < 1 ? <>Never slashed</> : <>Slashed {validator.slashes.length} times ({_.round(multiply(validator.slashes.reduce((sum, s) => add(sum, s.fraction), 0), 100), 2)}% total stake)</>}</small>
    return <span>{uptime}<br />{slashes}</span>
  }

  return (
    <>
      <div className="row">
        <div className="col-12 col-lg-6 small mb-3">
          <Table>
            <tbody>
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Validator Address</td>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} text-break`}><Address address={validator.operator_address} /></td>
              </tr>
              {!validator.active && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Status</td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}><ValidatorStatus validator={validator} /></td>
                </tr>
              )}
              {uptime() && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Uptime</td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>{uptime()}</td>
                </tr>
              )}
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">REStake</td>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {!!operator ? (
                    <Table className="m-0 table-sm">
                      <tbody className="small">
                        <tr>
                          <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>Frequency</td>
                          <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>{operator.runTimesString()}</td>
                        </tr>
                        <tr>
                          <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} ${network.authzSupport ? '' : 'border-bottom-0'}`}>Minimum rewards</td>
                          <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} ${network.authzSupport ? '' : 'border-bottom-0'}`}><Coins coins={minimumReward()} asset={network.baseAsset} fullPrecision={true} hideValue={true} /></td>
                        </tr>
                        {network.authzSupport && (
                          <tr>
                            <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} border-bottom-0`}>Last REStake</td>
                            <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} border-bottom-0`}>
                              <OperatorLastRestake operator={operator} lastExec={lastExec} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  ) :
                    <TooltipIcon icon={<XCircle className="opacity-50" />} identifier={validator.operator_address} tooltip="This validator is not a REStake operator" />
                  }
                </td>
              </tr>
              {network.apyEnabled && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">
                    <TooltipIcon
                      icon={<span className="text-decoration-underline">APY</span>}
                      identifier="delegations-apy"
                    >
                      <div className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} mt-2 text-center`}>
                        <p>Based on commission, compounding frequency and estimated block times.</p>
                        <p>This is an estimate and best case scenario.</p>
                      </div>
                    </TooltipIcon>
                  </td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {props.validatorApy[validator.operator_address]
                      ? <span>{round(props.validatorApy[validator.operator_address] * 100, 2).toLocaleString()}%</span>
                      : "-"
                    }
                  </td>
                </tr>
              )}
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Commission</td>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}><span>{validator.commission.commission_rates.rate * 100}%</span></td>
              </tr>
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Rank</td>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}><span>#{validator.rank}</span></td>
              </tr>
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Voting power</td>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}><span><Coins coins={{ amount: validator.tokens, denom: network.denom }} asset={network.baseAsset} /></span></td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="col-12 col-lg-6 small mb-3">
          <Table>
            <tbody>
              {!!validator.description?.security_contact && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Contact</td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}><a class='important-link' href={`mailto:${validator.description.security_contact}`}>{validator.description.security_contact}</a></td>
                </tr>
              )}
              {!!validator.description?.website && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`} scope="row">Website</td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} text-break`}><ValidatorLink className="text-decoration-underline" validator={validator}>{validator.description.website}</ValidatorLink></td>
                </tr>
              )}
              <tr>
                <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} align-middle`} scope="row">Profiles</td>
                <td>
                  <ValidatorServices validator={validator} network={network} theme={props.theme} exclude={['nodes', 'skip']} />
                </td>
              </tr>
              {validator?.path && (
                <tr>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} align-middle`} scope="row">Networks</td>
                  <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} w-75`}>
                    <ValidatorNetworks validator={validator} registryData={registryData} network={network} networks={networks} />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <p className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} mb-4`}>
            {validator.description?.details}
          </p>
          {!!network.chain.services?.skip && !!validator.services?.skip && (
            <>
              <p className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} mb-2 d-flex align-items-center gap-1`}>
                <a href="https://skip.money" target="_blank"><img src={props.theme === 'dark' ? SkipWhiteIcon : SkipIcon} height={14} className="d-block" /></a><strong>Skip MEV</strong>
              </p>
              <Table className="table-sm">
                <tbody>
                  <tr>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>Status</td>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {validator.services.skip.active ? (
                        <>
                          <span className="text-success">Active</span>
                          {validator.services.skip.front_running_protection && <><br />Front-running protected</>}
                        </>
                      ) : <span className="text-warning">Inactive</span>}
                    </td>
                  </tr>
                  <tr>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>Network profit</td>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {100 - validator.services.skip.val_payment_percentage}%<br />
                      <Coins coins={{ amount: validator.services.skip.network_profit, denom: network.denom }} asset={network.baseAsset} hideValue={true} />
                    </td>
                  </tr>
                  <tr>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} border-bottom-0`}>Validator profit</td>
                    <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} border-bottom-0`}>
                      {validator.services.skip.val_payment_percentage}%<br />
                      <Coins coins={{ amount: validator.services.skip.val_profit, denom: network.denom }} asset={network.baseAsset} hideValue={true} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {Object.entries(validator.public_nodes || {}).length > 0 && (
            <>
              <p className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} mb-2 d-flex align-items-center gap-1`}><HeartPulse /><strong>Public Nodes</strong></p>
              <Table className="table-sm">
                <tbody>
                  {Object.entries(validator.public_nodes).map(([type, nodes]) => {
                    return (
                      <tr key={type}>
                        <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                          {type.toUpperCase()}
                        </td>
                        <td className={`${props.theme === 'dark' ? 'text-white' : 'text-black'} list-group list-group-flush flex-fill`}>
                          {nodes.map(api => {
                            return <a href={api.address} target="_blank" className="text-reset text-decoration-underline">{api.address}</a>
                          }).reduce((prev, curr) => [prev, <br />, curr])}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ValidatorProfile
