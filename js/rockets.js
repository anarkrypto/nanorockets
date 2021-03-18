const rocket_width = 60 // in px
const rocket_height = "130"

const speed = 10

const SPEED_MULTIPLIER = true

const min_x = document.querySelector(".rockets-zone").getBoundingClientRect().left
const max_x = document.querySelector(".rockets-zone").getBoundingClientRect().right

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function hashToDeg(hash) {
    const firtByteN = parseInt(hash[0] + hash[1], 16) // hash first byte to int
    const lastByteN = parseInt(hash[60] + hash[61], 16) // hash last byte to int
    let deg = parseInt(firtByteN / 2.56) - 50
    if (lastByteN <= 127) deg *= -1
    return deg
}

async function createRocket(hash, address) {
    const rocketID = "rocket_" + hash
    const rocketX_start = getRandomArbitrary(min_x, max_x)
    let rocketEl = document.createElement("div");
    rocketEl.id = rocketID
    rocketEl.classList.add('rocket');
    rocketEl.style.left = rocketX_start + "px"
    const rocket_inclination = hashToDeg(hash)
    rocketEl.style.transform = 'rotate(' + rocket_inclination + 'deg)';
    rocketEl.setAttribute("data-rotate", rocket_inclination)
    const linkExplorer = 'https://nanocrawler.cc/explorer/block/' + hash;
    rocketEl.setAttribute('onclick', 'window.open("' + linkExplorer + '", "_blank");')

    let rocketInfo = document.createElement("div")
    rocketInfo.classList.add("rocketInfo")
    rocketInfo.innerHTML = '\
        <img src=""> \
        <p>Account: <span class="account"></spam></p> \
        <p><span class="action"></span><span class="action_details"></p> \
        <p></p> \
    ';



    let rocketNatricon = document.createElement("div");
    rocketNatricon.classList.add('natricon')
    await natricon(address).then(res => {
        const natrIcon = document.createElement("img")
        natrIcon.src = res
        rocketNatricon.appendChild(natrIcon)
    })

    rocketEl.appendChild(rocketInfo)
    rocketEl.appendChild(rocketNatricon)


    document.querySelector(".rockets-zone").appendChild(rocketEl);
    return (rocketID)
}

function removeRocket(rocket_id){
    $('#'+rocket_id).fadeOut(700)
    $('#'+rocket_id).remove()
}

async function activateMoon(){
    let x = 0
    function loop() {
        if (x == 40) {
            document.querySelector(".moon-zone").classList.remove("active")
            clearInterval(runLoop);
            return
        }
        document.querySelector(".moon-zone").classList.add("active")
        x++;
    } 
    let runLoop = setInterval(loop, 50);
}

async function launchRocket(rocket_id, rocket_speed) {
    console.log("Launching rocket: " + rocket_id)
    const moon_el = document.querySelector(".moon-zone")
    const moon_rect = moon_el.getBoundingClientRect();
    const moonY = moon_rect.bottom

    const rocket_el = document.getElementById(rocket_id)

    const rocket_rect = rocket_el.getBoundingClientRect();
    let rocketY = rocket_rect.top

    //rocket_inclination
    const g = parseInt(rocket_el.getAttribute('data-rotate'))
    
    let move = 0

    var id = null;

    let speed = 1000 / (rocket_speed * 3)

    id = setInterval(frame, speed);

    
    async function frame (){
        if (rocketY < (0 - rocket_height)) {
            clearInterval(id);
            removeRocket(rocket_id)
        } else {
            //rocketY = rocketY
    
            let rocketLeft = parseInt(rocket_el.style.left)
            let rocketRight = rocketLeft + rocket_width
    
            //go to left
            if (g < -40) { move = -2.5 }
            else if (g < -30) { move = -2 }
            else if (g < -20) { move = -1.5 }
            else if (g < -10) { move = -1 }
            else if (g < 0) { move = -0.5 }
    
            // if (g == 0) do nothing
    
            //go to right
            if (g > 40) { move = 2.5 }
            else if (g > 30) { move = 2 }
            else if (g > 20) { move = 1.5 }
            else if (g > 10) { move = 1 }
            else if (g > 0) { move = 0.5 }
    
            rocketLeft += move    
            rocketY -= 6 - Math.abs(move)

            rocket_el.style.left = rocketLeft + "px"
            rocket_el.style.top = rocketY + "px";
    
            if (rocket_el.getBoundingClientRect().top <= moon_el.getBoundingClientRect().bottom
                && rocket_el.getBoundingClientRect().left >= moon_el.getBoundingClientRect().left
                && rocket_el.getBoundingClientRect().right <= moon_el.getBoundingClientRect().right)
            {
                    console.log("Nano to the moon! " + rocket_el.id)
                    rocket_el.style.borderColor = "green"
                    activateMoon()
                    removeRocket(rocket_id)
                    clearInterval(id);
                    return true
            }
    
        }
    }
}