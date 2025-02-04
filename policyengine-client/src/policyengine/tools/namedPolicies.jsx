import { Redirect, Route } from "react-router-dom";

export default function createRedirects(namedPolicies, country) {
    const pages = ["policy", "population-impact", "household"];
    let redirects = [];
    for (let page of pages) {
        for(let url of Object.keys(namedPolicies)) {
            redirects.push(
                <Route
                    exact 
                    key={page + "/" + url}
                    path={`/${country}/${page}${url}`}
                >
                    <Redirect 
                        to={`/${country}/${page}?${namedPolicies[url]}`}
                    />
                </Route>
            );
        }
    }
    return redirects;
}