import SocialLinks from "../header/socialLinks";
import { BackTop, Divider } from "antd";
import { useContext } from "react";
import { CountryContext } from "../../countries";


export default function Footer() {
    const country = useContext(CountryContext);
	return (
		<div style={{paddingBottom: 25}}>
			<BackTop />
			<Divider style={{marginTop: 50}} />
			<div className="d-none d-lg-block">
				<div className="d-flex justify-content-center">
					<p style={{textAlign: "center"}}><a href="https://policyengine.org">PolicyEngine © 2021</a> | <a href={`/${country.name}/faq`}>FAQ</a> | <a href="https://blog.policyengine.org">Blog</a> | <a href="https://zej8fnylwn9.typeform.com/to/XFFu15Xq">Feedback</a> | <a href="https://opencollective.com/psl">Donate</a></p>
				</div>
			</div>
			<div className="d-flex d-lg-none justify-content-center">
				<SocialLinks color="black"/>
			</div>
			<div className="d-block d-lg-none">
				<p style={{textAlign: "center"}}><a href="https://policyengine.org">PolicyEngine © 2021</a> | <a href={`/${country.name}/faq`}>FAQ</a> | <a href="https://blog.policyengine.org">Blog</a></p>
				<p style={{textAlign: "center"}}><a href="https://zej8fnylwn9.typeform.com/to/XFFu15Xq">Share your feedback</a> | <a href="https://opencollective.com/psl">Donate</a></p>
			</div>
		</div>
	)
}