let starSet = [];
let starCount = 0;
let starColors = ["#fff5f2","#ffeedd","#ffcc6f","#b5c7ff"];
let starSizes = [[1,2],[2,4]];
let xRange = [0,window.innerWidth];
let yRange = [0,500];
let sizeRange = [1,4];
let periodRange = [5,30];
let hour = 0;
let night = true;
let opacity = 1;
let period = 50;

let skyState = {
    starSet: [],
    starCount: 0,
    starColors: ["yellow","white"],
    starSizes: [[1,2],[2,4]],
    xRange: [0,1000],
    yRange: [0,500],
    currentRGBArray : [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,116],
        [128,0,128],
],
    daytimeRGBArray : [
        [4,99,202],
        [28,109,196],
        [30,135,226],
        [115,146,231],
        [256,256,256],
],
    nighttimeRGBArray: [
        [0,0,0],
        [0,0,0],
        [0,0,0],
        [0,0,90],
        [110,0,110],
],
incrementRGBArray: [
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
    [0,0,0],
],


}


class Star {
    constructor(x,y,color,min,max,period){
        this.id = "star"+starCount;
        this.x = x;
        this.y = y;
        this.color = color;
        this.min = min;
        this.max = max;
        this.size = min;
        this.period = period;
        this.stage = 0;
    }
}

function createStar(x,y,color,min,max,period){
    starSet[starSet.length] = new Star(x,y,color,min,max,period);
    obj = starSet[starSet.length-1];
    let el = document.createElement("div");
    document.querySelector("body").appendChild(el);
    el.className = "star";
    el.id = obj.id;
    // el.style.backgroundColor = obj.color;
        el.style.backgroundColor = color;

    updateStar(obj);
    starCount++;
}

function updateStar(obj){
    el = document.getElementById(obj.id);
    el.style.left = obj.x + "px";
    el.style.top = obj.y+ "px";
    el.style.width = obj.size +"px";
    el.style.height = obj.size + "px";

}

function setInitialSky(x){
    for(i=0;i<x;i++){
        let x = pickRandInt(xRange);
        let y = pickRandInt(yRange);
        let min = pickRandInt(sizeRange);
        let color = pickRandEl(starColors);
        createStar(x,y,color,min,(min*1.5),pickRandInt(periodRange));
    }
}

setInitialSky(100);

// picks a random integer between and inclusive of first two elements
function pickRandInt(array){
    return Math.round(Math.random()*(array[1]-array[0]))+array[0];
}
function pickRandEl(array){
    let index = Math.floor(Math.random()*array.length);
    return array[index];
}



function moveSky(){
    for (star of starSet){
        star.x++;
        star.stage++;
        if (star.x > (xRange[1]-10)){
            star.x = 0;
        }
        if (star.stage == star.period){
            star.size = pickRandInt([star.min,star.max]);
            star.stage = 0;
        }

        
        updateStar(star);
    }
    hour = hour + 0.1;
    if (hour > 6 && night){
        dawn();
    }
    if (hour>18 && !night){
        dusk();
    }
    if (hour >= 24){
        hour = 0;
    }
}

setInterval(moveSky,200);


function dawn(){
    document.body.style.backgroundImage = createGradient();
    night = false;
    skyState.incrementRGBArray = makeIncrementArray(100);
        // // Get a NodeList of all .demo elements
        // const starClass = document.querySelectorAll('.star');

        // // Change the text of multiple elements with a loop
        //     starClass.forEach(element => {
        //         element.style.opacity = '0';
        //     });
}

function dusk(){
    document.body.style.backgroundImage = createGradient();
    night=true;
    skyState.incrementRGBArray = makeIncrementArray(100);
            // // Get a NodeList of all .demo elements
            // const starClass = document.querySelectorAll('.star');

            // // Change the text of multiple elements with a loop
            //     starClass.forEach(element => {
            //         element.style.opacity = '1';
            //     });

}

function createGradient(){
    obj = skyState.currentRGBArray;
    let gradient = "linear-gradient(";
    for (i=0;i<obj.length;i++){
    let color = "rgb("+obj[i][0]+", "+obj[i][1]+", " + obj[i][2]+"),";
    gradient = gradient+color;
    }
    gradientFixed = gradient.slice(0,-1) + ")";
    return gradientFixed;
}

function makeIncrementArray(period){
    let inc = skyState.incrementRGBArray;
    if (night){
        start = skyState.daytimeRGBArray;
        target = skyState.nighttimeRGBArray;
    }
    else {
        start = skyState.nighttimeRGBArray;
        target = skyState.daytimeRGBArray;
    }

    for(i=0;i<inc.length;i++){
        for(j=0;j<inc[i].length;j++){
            inc[i][j] = (target[i][j]-start[i][j])/period;
        }
    }
    return inc;
}

setInterval(changeLight,200);

function changeLight(){
    if (night){
        target = skyState.nighttimeRGBArray;
    }
    else target = skyState.daytimeRGBArray;
    cur = skyState.currentRGBArray;
    inc = skyState.incrementRGBArray;
    if (Math.round(cur[0][0]) == Math.floor(target[0][0])){
        return;
    }
    for (i=0;i<inc.length;i++){
        for(j=0;j<inc[i].length;j++){
            cur[i][j] = cur[i][j] + inc[i][j];
        }
    }
    skyState.currentRGBArray = cur;
    document.body.style.backgroundImage = createGradient();
    if (night){
        if (opacity>=1){
            return;
        }
        else opacity = opacity + 1/period;
    }
    if (!night){
        if (opacity <= 0){
            return;
        }
        else opacity = opacity - 1/period;
    }
                // Get a NodeList of all .demo elements
                const starClass = document.querySelectorAll('.star');

                // Change the text of multiple elements with a loop
                    starClass.forEach(element => {
                        element.style.opacity = opacity;
                    });



}

function enterText(text){
    el = document.getElementById(text);
    el.style.color = "red";
}

function exitText(text){
    el = document.getElementById(text);
    el.style.color = "white";
}


let aboutMe =     `
<div id="section-text">Hello, my name is Joe Christianson. I'm a pretty cool dude if you know what I mean. I'm into the party scene. I know people.</div>
</div>`;
// let projects =     `
// <div id="project-list">
// <h3 onclick='project(project0)'>Project 0</h3>
// <h3 onclick='project(project1)'>Project 1</h3>
// <h3 onclick='project(project2)'>Project 2</h3>
// <h3 onclick='project(project3)'>Project 3</h3>
// <h3 onclick='project(project4)'>Project 4</h3>
// </div>`;
let contact =   `
<div class="contact-container">
  <form action="action_page.php">

    <label for="fname">First Name</label>
    <input type="text" id="fname" name="firstname" placeholder="Your name..">

    <label for="lname">Last Name</label>
    <input type="text" id="lname" name="lastname" placeholder="Your last name..">

    <label for="country">Country</label>
    <select id="country" name="country">
      <option value="australia">Australia</option>
      <option value="canada">Canada</option>
      <option value="usa">USA</option>
    </select>

    <label for="subject">Subject</label>
    <textarea id="subject" name="subject" placeholder="Write something.." style="height:200px"></textarea>

    <input type="submit" value="Submit">

  </form>
</div>

`;

let socials =   `
<p>
Socials Go Here.
</p>
`;



function switchContent(section,isProject){
    let sect = document.getElementById('content-area');
    if (sect){
        sect.remove();
    }
    let contentArea = document.createElement('div');
    contentArea.id = "content-area";
    if (isProject){
        contentArea.className = "project-box";
    }
    contentArea.innerHTML = section;
    el = document.getElementById("right");
    document.getElementById('right').append(contentArea);
    if (section == contact){
        contentArea.style.marginRight = "25%";
        contentArea.style.marginLeft = "25%";
    }

}



class Project {
    constructor(name,image,description,skillsUsed,appLink,codeLink){
        this.name = name;
        this.image = image;
        this.description = description;
        this.skillsUsed = skillsUsed;
        this.appLink = appLink;
        this.codeLink = codeLink;
    }
    listSkills() {
        let skillsHtml = "";
        for (i=0;i<this.skillsUsed.length;i++){
            skillsHtml+= "<li>"+this.skillsUsed[i]+"</li>";
        }
        return skillsHtml;
    }
}

let project0 = new Project("Ticket System","images/ticket-system.png","A complete ticket system used for web app development.",["HTML","Javascript","PHP"],"https://joechristianson.com/ticketsystem","https://joechristianson.com/ticketsystemcode");
let project1 = new Project("News Aggregator","images/news-aggregator.png","A complete ticket system used for web app development.",["HTML","Javascript","PHP"],"https://joechristianson.com/ticketsystem","https://joechristianson.com/ticketsystemcode");
let project2 = new Project("Google Clone","images/google-clone.png","A complete ticket system used for web app development.",["HTML","Javascript","PHP"],"https://joechristianson.com/ticketsystem","https://joechristianson.com/ticketsystemcode");
let project3 = new Project("History Game","images/history-game.png","A complete ticket system used for web app development.",["HTML","Javascript","PHP"],"https://joechristianson.com/ticketsystem","https://joechristianson.com/ticketsystemcode");
let project4 = new Project("Space Shooter","images/space-shooter.png","A complete ticket system used for web app development.",["HTML","Javascript","PHP"],"https://joechristianson.com/ticketsystem","https://joechristianson.com/ticketsystemcode");

function project(project){
    if (document.getElementById('project-box')){
        document.getElementById('project-box').remove();
    }
    let content = `
    <div>
    <img id="screenshot" src=${project.image}>
    </div>
    <div id="project-text">
            <h2 id="project-name">${project.name}</h2>

            <div id="description">${project.description}</div>
            <h4>Skills Employed</h4>
            <hr>
            <ul id="skills-list">${project.listSkills()}</ul>
            <br>
            <div id="links">
            <a id="app-link" href=${project.appLink}>Application</a>
            <a id="code-link" href=${project.codeLink}>Code</a>     
            </div>   
    </div>
            `
    switchContent(content,true);
}