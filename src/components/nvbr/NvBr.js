import React from "react";
import './NvBr.css'

function NvTb(props){
    return(
        <div className="NavTb">
            <a href={props.tag} className='NavTg'>
                <h3>{props.label}</h3>
            </a>
        </div>
    )
}
function TglM(){
    var x = document.getElementById('NavCon');
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}
window.onresize = function(event)
{
document.location.reload(true);
}
function NvBr(){
    return(
        <div id="Nav">
            <div className="HeadEr">
                <button id="NavSwitch" onClick={TglM}>
                    <svg viewBox="0 0 100 100" height='2rem' width='2rem'>
                        <path d="M 10 25 L 90 25 M 10 50 L 60 50 M 10 75 L 30 75" stroke='white' strokeWidth= '0.6rem' strokeLinecap="round" fill="none" />
                    </svg>
                </button>
                <h1 id="HeadLine">lorem</h1>
            </div>
            <div id="NavCon">
                <NvTb tag='#home' label = 'Home' />
                <NvTb tag='#abt' label = 'About' />
                <NvTb tag='#prjts' label = 'Projects' />
                <NvTb tag='#cntcts' label = 'Contacts' />
            </div>
        </div>
    )
}
export default NvBr