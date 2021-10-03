import { Divider, Collapse } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Row, Col } from "react-bootstrap";
import { Fragment, default as React } from "react";
import { Overview } from "../common/overview";
import { LoadingResultsPane, TakeAway, Chart } from "../common/results";

const { Panel } = Collapse;

function PopulationResultsCaveats() {
	return (
		<Collapse defaultActiveKey={["1"]} ghost>
			<Panel header={<><ExclamationCircleOutlined />  Disclaimer</>} key="1">
				<p>Results are calculated using the OpenFisca-UK tax-benefit microsimulation model, and assume no behavioural or macroeconomic effects. See the <a href="https://github.com/PSLmodels/openfisca-uk">repository</a> for more information.</p>
			</Panel>
		</Collapse>
	);
}


export function PopulationResultsPane(props) {
	const isSurplus = props.results.net_cost[0] == "-";
	const cost = isSurplus ? props.results.net_cost.slice(1) : props.results.net_cost;
	const costColor = isSurplus ? "green" : "darkred";
	const isPovRise = +props.results.poverty_change > 0;
	const isPovFall = +props.results.poverty_change < 0;
	let pov = Math.round(Math.abs(props.results.poverty_change) * 100);
	const povColor = isPovRise ? "darkred" : (isPovFall ? "green" : "grey");
	const winners = Math.round(+props.results.winner_share * 100);
	const winnerColor = winners > 0 ? "green" : (winners == 0 ? "grey" : "darkred");
	const losers = Math.round(+props.results.loser_share * 100);
	const loserColor = losers > 0 ? "darkred" : (losers == 0 ? "grey" : "green");
	return (
		<>
			<Divider>Population results</Divider>
			<PopulationResultsCaveats />
			<Row style={{padding: 30}}>
				<TakeAway><p style={{textAlign: "center"}}>Reform produces <br /><span style={{color: costColor}}>{cost}</span> net {isSurplus ? "surplus" : "cost"}</p></TakeAway>
				<TakeAway><p style={{textAlign: "center"}}>Poverty <br />{isPovRise ? "rises" : "falls"} <span style={{color: povColor}}>{pov}%</span></p></TakeAway>
				<TakeAway><p style={{textAlign: "center"}}><span style={{color: winnerColor}}>{winners}%</span> of people <br />come out ahead</p></TakeAway>
				<TakeAway><p style={{textAlign: "center"}}><span style={{color: loserColor}}>{losers}%</span> of people <br />come out behind</p></TakeAway>
			</Row>
			<Row>
				<Chart plot={props.results.waterfall_chart} md={12} />
			</Row>
			<Row>
				<Chart plot={props.results.poverty_chart} md={12} />
			</Row>
			<Row>
				<Chart plot={props.results.decile_chart} md={12}/>
			</Row>
			<Row>
				<Chart plot={props.results.intra_decile_chart} md={12}/>
			</Row>
		</>
	);
}


export class PopulationResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {plan: this.props.policy, results: null, waiting: false, error: false};
		this.simulate = this.simulate.bind(this);
	}

	componentDidMount() {
		this.simulate();
	}

	simulate() {
		const submission = {};
		for (const key in this.state.plan) {
			if(this.state.plan[key].value !== this.state.plan[key].default) {
				submission["policy_" + key] = this.state.plan[key].value;
			}
		}
		let url = new URL(`https://${this.props.country || "uk"}.policyengine.org/api/population-reform`);
		url.search = new URLSearchParams(submission).toString();
		this.setState({ waiting: true }, () => {
			fetch(url)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				}).then((json) => {
					this.setState({ results: json, waiting: false, error: false });
				}).catch(e => {
					this.setState({waiting: false, error: true});
				});
		});
	}

	render() {
		return (
			<Row style={{paddingLeft: 50}}>
				<Col xl={9}>
					{
						(this.state.waiting || (!this.state.results && !this.state.error)) ?
							<div className="d-flex justify-content-center align-items-center" style={{minHeight: 400}}>
								<LoadingResultsPane message="Simulating your results on the UK population (this usually takes about 10 seconds)"/>
							</div> :
							this.state.error ?
								<div className="d-flex justify-content-center align-items-center" style={{minHeight: 400}}>
									<LoadingResultsPane noSpin message="Something went wrong (try navigating back and returning to this page)"/>
								</div> :
								<PopulationResultsPane results={this.state.results} />
					}
				</Col>
				<Col xl={3} style={{paddingLeft: 50}}>
					<Overview policy={this.props.policy} page="population-impact"/>
				</Col>
			</Row>
		);
	}
}