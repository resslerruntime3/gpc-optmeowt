/*
Licensed per https://github.com/privacy-tech-lab/gpc-optmeowt/blob/main/LICENSE.md
privacy-tech-lab, https://www.privacytechlab.org/
*/


/*
about-view.js
================================================================================
about-view.js loads about-view.html when clicked on the options page
*/


import { renderParse, fetchParse } from '../../components/util.js'

/**
 * @typedef headings
 * @property {string} headings.title - Title of the given page
 * @property {string} headings.subtitle - Subtitle of the given page
 */
const headings = {
    title: 'About',
    subtitle: "Learn more about OptMeowt"
}

/**
 * Renders the `About` view in the options page
 * @param {string} scaffoldTemplate - stringified HTML template
 */
export async function aboutView(scaffoldTemplate) {
    const body = renderParse(scaffoldTemplate, headings, 'scaffold-component')
    let content = await fetchParse('./views/about-view/about-view.html', 'about-view')

    document.getElementById('content').innerHTML = body.innerHTML
    document.getElementById('scaffold-component-body').innerHTML = content.innerHTML
}
