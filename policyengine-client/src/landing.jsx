import React from "react";
import { PolicyEngineWrapper } from "./policyengine/layout/general";
import { Row, Col, Container } from "react-bootstrap";
import { Card, Divider as DefaultDivider, Tag } from "antd";

import UKFadedBlue from "./images/uk_faded_blue.png";
import USFadedBlue from "./images/us_faded_blue.png";
import { Footer } from "./policyengine/footer";
import { Header } from "./policyengine/header";


function Divider(props) {
    return <DefaultDivider {...props} style={{marginTop: 50, marginBottom: 50}} />
}

export default function LandingPage() {
    return (
        <PolicyEngineWrapper>
            <Header noTabs/>
            <Container>
                <LandingPageContent />
            </Container>
        </PolicyEngineWrapper>
    );
}

function Subheader(props) {
    return <><Divider /><Row style={{marginTop: 10, marginBottom: 10}}>
        <h2>{props.children}</h2>
        <h6>{props.subtitle}</h6>
    </Row>
    </>
}

function UsageBox(props) {
    // e.g. title = "Citizens", description = "Citizens can use PolicyEngine to do X."

    // Displays the title anchored to the left (and big) and the description anchored to the right (and small)

    return <Row style={{marginTop: 20, marginBottom: 20}}>
        <Col xs={12} md={6}>
            <h3 style={{marginBottom: 0}}>{props.title}</h3>
        </Col>
        <Col xs={12} md={6}>
            <p style={{marginTop: 0}}>{props.description}</p>
        </Col>
    </Row>


}

function UsageExplanations(props) {
    return <>
        <UsageBox title="Citizens" description="Check your eligibility for government benefits and programs. Simulate how a change in requirements could affect your household." />
        <UsageBox title="Think tanks" description="Simulate tax-benefit reforms on the UK economy and individual households to better understand and recommend policy changes." />
        <UsageBox title="Parties and campaigns" description="Estimate the economic oucomes of your policy proposals. Produce evidence-based talking points and refute speculative criticism of your platform." />
        <UsageBox title="Developers" description="Allow your users to check their benefits eligibility with our API. Contribute to our work on GitHub." />
    </>
}

function LandingPageContent() {
    return <>
        <Row>
            <Col lg={10} style={{paddingTop: 50}}>
                <h4><b>PolicyEngine</b> empowers people to understand and change public policy. </h4><br /><h4>Our app lets anyone imagine reforms to the tax and benefit system and see the impact on society and their own household.</h4>
            </Col>
            <Col lg={2}></Col>
        </Row>
        <Subheader></Subheader>
        <Row>
            <Col md={6}>
                <Card 
                    style={{marginTop: 10}} 
                    hoverable
                    bordered={false}
                    cover={<img alt="UK" src={UKFadedBlue} />}
                    onClick={() => window.location.href = "/uk"}
                >
                    <h6>Explore the impact of tax-benefit reforms on UK households, powered by our fully-featured UK microsimulation model.</h6>
                </Card>
            </Col>
            <Col md={6}>
                <Card 
                    style={{marginTop: 10}} 
                    hoverable
                    bordered={false}
                    cover={<img alt="US" src={USFadedBlue} />}
                    onClick={() => window.location.href = "/us"}
                >
                    <h6><Tag key="beta" color="#002766">BETA</Tag>Explore the impact of tax-benefit reforms on US households.</h6>
                </Card>
            </Col>
        </Row>
        <Subheader>Who we help</Subheader>
        <UsageExplanations />
        <Subheader subtitle={<><p>We're currently seeking funding partners, volunteer developers and policy analysts to expand our work and its impact. </p><p>Is that you? <a href="mailto:hello@policyengine.org">Get in touch.</a></p></>}></Subheader>
        <Subheader subtitle="Analyses of policy reforms by the PolicyEngine team.">Commentary</Subheader>
        <MediumFeed />
        <Footer />
    </>
}

class MediumFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feed: null,
        }
    }

    componentDidMount() {
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2Fpolicyengine").then(res => res.json()).then(feed => {
            this.setState({ feed: feed });
        });
    }

    render() {
        if(!this.state.feed) {
            return <></>;
        }
        const items = this.state.feed.items.map(post => 
            <Col md={3} style={{display: "inline-block"}}>
                <Card hoverable style={{marginTop: 10}} bordered={false} cover={
                    <img style={{minHeight: 200, objectFit: "cover"}} alt={post.title + " cover image"} src={post.thumbnail} />
                }
                    onClick={() => window.open(post.link, "_blank")}
                >
                    <h5>{post.title}</h5>
                </Card>
            </Col>
        )
        return <Row>{items}</Row>
    }
}