/*
OptMeowt is licensed under the MIT License
Copyright (c) 2021 Kuba Alicki, Stanley Markman, Oliver Wang, Sebastian Zimmeck
Previous contributors: Kiryl Beliauski, Daniel Knopf, Abdallah Salia
privacy-tech-lab, https://privacytechlab.org/
*/


/*
domainlist-view.js
================================================================================
domainlist-view.js loads domainlist-view.html when clicked on the options page
*/


import { storage, stores } from '../../../background/storage.js';
import { renderParse, fetchParse } from '../../components/util.js'


/******************************************************************************/
/***************************** Dropdown Functions *******************************/
/******************************************************************************/


/*
 * @param {string} domain - domain to be changed in domainlist
 */

export async function dropListener(domain) {
  document.getElementById("li " + domain).addEventListener("click", () => {
    // var icon = document.getElementById("dropdown")
    if (document.getElementById(domain + " analysis").style.display === "none") {
      document.getElementById(domain + " compliance").style.marginTop = "auto"
      document.getElementById("dropdown " + domain).src = "../assets/chevron-up.svg"
      document.getElementById(domain + " analysis").style.display = ""
      //document.getElementById("li " + domain).classList.add("dropdown-tab-click")
      document.getElementById("divider " + domain).style.display = ""
    } else {
      document.getElementById(domain + " compliance").style.marginTop = "auto"
      document.getElementById("dropdown " + domain).src = "../assets/chevron-down.svg"
      document.getElementById(domain + " analysis").style.display = "none"
      //document.getElementById("li " + domain).classList.remove("dropdown-tab-click")
      document.getElementById("divider " + domain).style.display = "none"
    }
  });
}

/**
 * Creates the specific Domain List toggles as well as the perm delete
 * buttons for each domain
 */
 async function createDropListeners(){
  let verdict;
  const domainlistKeys = await storage.getAllKeys(stores.domainlist)
  const domainlistValues = await storage.getAll(stores.domainlist)
  let domain;
  let domainValue;
  for (let index in domainlistKeys) {
    let x = Math.round(Math.random());
    if(x){
      verdict = true;
    }else{
      verdict = false;
    }
    domain = domainlistKeys[index];
    //console.log(domain);
    dropListener(domain)
    compliant(verdict, domain)
  }
}


/**
 * Create the compliance label
 * @param {string} domain
 */
 function compliant (verdict ,domain) {
   let identifier = document.getElementById(`${domain} compliance`);
   if(verdict == true){
    identifier.style.border = "1px solid #00f485";
    identifier.style.color = "#00f485";
    identifier.innerText = "Compliant";
   } else {
    identifier.style.border = "1px solid #f44336";
    identifier.style.color = "#f44336";
    identifier.innerText = "Not Compliant";
   }

}


/**
 * Delete buttons for each domain
 * @param {string} domain
 */
 function deleteButtonListener (domain) {
  document.getElementById(`delete ${domain}`).addEventListener("click",
    (async () => {
      let deletePrompt = `Are you sure you would like to permanently delete this domain from the Domain List?`
      let successPrompt = `Successfully deleted ${domain} from the Domain List.
NOTE: It will be automatically added back to the list when the domain is requested again.`
      if (confirm(deletePrompt)) {
        // await storage.delete(stores.domainlist, domain)
        chrome.runtime.sendMessage({ msg: "REMOVE_FROM_DOMAINLIST", data: domain });
        alert(successPrompt)
        document.getElementById(`li ${domain}`).remove();
      }
  }))
}

/******************************************************************************/

/**
 * @typedef headings
 * @property {string} headings.title - Title of the given page
 * @property {string} headings.subtitle - Subtitle of the given page
 */
const headings = {
    title: 'Analyzed Domains',
    subtitle: "A breakdown of the CCPA compliance of sites you have visited"
}

/**
 * Filtered lists code heavily inspired by
 * `https://www.w3schools.com/howto/howto_js_filter_lists.asp`
 *
 * Enables live filtering of domains via the search bar
 */
 function filterList() {
  let input, list, li, count
  input = document.getElementById('searchbar').value.toLowerCase();
  list = document.getElementById('domainlist-main')
  li = list.getElementsByTagName('li')
  count = li.length

  for (let i = 0; i < count; i++) {
      let d = li[i].getElementsByClassName('domain')[0];
      let txtValue = d.innerText;
      if (txtValue.toLowerCase().indexOf(input) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  };
}

/**
 * Creates the event listeners for the `domainlist` page buttons and options
 */
async function eventListeners() {
    document.getElementById('searchbar').addEventListener('keyup', filterList )
    // document.getElementById('plus-button').addEventListener('keyup', plusButton )
    await createDropListeners();

    window.onscroll = function() { stickyNavbar() };
    var nb = document.getElementById("domainlist-navbar");
    var sb = document.getElementById("searchbar")
    var sticky = nb.offsetTop;

    /**
     * Sticky navbar
     */
    function stickyNavbar() {
      if (window.pageYOffset >= sticky) {
        nb.classList.add("sticky")
        // nb.classList.add("uk-grid")
        // sb.classList.add("uk-width-1-2")
        // document.getElementById("width-expand").classList.remove("uk-width-expand")
      } else {
        nb.classList.remove("sticky")
        // sb.classList.remove("uk-width-3-4")
      }
    }
}

/**
 * Builds the list of domains in the domainlist, and their respective
 * options, to be displayed
 */
async function buildList() {
  let pos = "../../../../assets/cat-w-text/check1.png";
  let neg = "../../../../assets/cat-w-text/cross1.png"
  let specs = `style= "
    margin-right: 5px;
    margin-left: 5px;
    margin-top: auto;
    margin-bottom: auto;
    padding-right: 5px;
    padding-left: 5px;"
    `
  let items = ""
  let domain;
  let domainValue; 
  const domainlistKeys = await storage.getAllKeys(stores.domainlist)
  const domainlistValues = await storage.getAll(stores.domainlist)
  for (let index in domainlistKeys) {
    domain = domainlistKeys[index]
    domainValue = domainlistValues[index]
    items +=
          `
    <li id="li ${domain}">
      <div id = "div ${domain}" uk-grid class="uk-grid-small uk-width-1-1" style="font-size: medium;">
        <div>
          <div
          class="uk-container-analysis"
          style="margin: auto; padding: 0; padding-left: 30px;"
          uk-tooltip="Dropdown"
        >
          <img
            id="dropdown ${domain}"
            src="./assets/chevron-down.svg"
            height="15"
            width="15"
            alt="dropdown"
            uk-svg
          />
        </div>
            <span></span>
          </label>
        </div>
        <div class="domain uk-width-expand">
          ${domain}
          <hr class="divide" id="divider ${domain}" style="margin:0px; display: none">
          <ul id="${domain} analysis" class="uk-list" style="display:none">
            <li>
            <div uk-grid class="uk-grid-small uk-width-1-1" style="font-size: large;">
            <div class="domain uk-width-expand">
             DNS Link 
             </div>
             <img src = ${pos} width = "40px" height = "40px" ${specs}>
             </div>
             </li>
            <li>
            <div uk-grid class="uk-grid-small uk-width-1-1" style="font-size: large;">
            <div class="domain uk-width-expand">
             US Privacy String 
             </div>
             <img src = ${pos} width = "40px" height = "40px" ${specs}>
             </div>
             </li>
            <li>
            <div uk-grid class="uk-grid-small uk-width-1-1" style="font-size: large;">
            <div class="domain uk-width-expand">
             Signal Sent 
             </div>
             <img src = ${pos} width = "40px" height = "40px" ${specs}>
             </div>
             </li>
            <li>
            <div uk-grid class="uk-grid-small uk-width-1-1" style="font-size: large;">
            <div class="domain uk-width-expand">
             US Privacy String Updated 
             </div>
             <img src = ${neg} width = "40px" height = "40px" ${specs}>
             </div> 
             </li>
          </ul>
        </div>

        <div style="
          margin-right: 5px;
          margin-left: 5px;
          margin-top: auto;
          margin-bottom: auto;
          "
        >
          <label class="switch" >
          `

          +
          `
            <span></span>
          </label>
          <div
          id = "${domain} compliance"
          class="uk-badge"
          style="
            margin-right: 5px;
            margin-left: 5px;
            margin-top: auto;
            margin-bottom: auto;
            padding-right: 5px;
            padding-left: 5px;
            background-color: white;
            border: 1px solid #ffff00;
            color: #ffff00;
          "
        >
          Loading...
        </div>
    </li>
          `
  }
  document.getElementById('domainlist-main').innerHTML = items;
}

/**
 * Renders the `domain list` view in the options page
 * @param {string} scaffoldTemplate - stringified HTML template
 */
export async function domainlistView(scaffoldTemplate) {
    const body = renderParse(scaffoldTemplate, headings, 'scaffold-component')
    let content = await fetchParse('./views/domainlist-view/domainlist-view.html', 'domainlist-view')

    document.getElementById('content').innerHTML = body.innerHTML
    document.getElementById('scaffold-component-body').innerHTML = content.innerHTML

    await buildList();

    eventListeners();
}
