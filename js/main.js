const donate_address = "nano_3rrngdugx7c4qkbfx8cjzhthhanwm3e9zstwrpef9ebaka37uuo1p8tdy315"

function donate(){
    $("#donateModal").modal()
}

function donated(){
    if ($("#donateModal").hasClass("in")){
        alert("Donation received! If you, thank you! We are working on a special animation.")
    } 
}

// 60 second CPS tracker
var cps_tracker = new Array(60).fill(0);
setInterval(update_cps, 1 * 1000);

function update_cps() {
    // Every second update the array
    cps_tracker = cps_tracker.slice(1);
    cps_tracker.push(0);
    show_cps();
}

function show_cps() {
    // Update GUI
    let cps = cps_tracker.reduce(function (a, b) { return a + b; }, 0) / cps_tracker.length;
    const cpsInfo = document.getElementById("cps_info")
    cpsInfo.innerText = 'CPS: ' + cps.toFixed(2) + ' /sec'
}

async function handle_new_block(data) {

    // Update CPS
    cps_tracker[cps_tracker.length - 1] += 1;

    // Donation?
    if (data.block.subtype == 'send' && data.block.link_as_account == donate_address) {
       donated(data);
    }

    // Create Rocket
    if(!document.hidden) {
        const rocketID = await createRocket(data.hash, data.account)
        work_difficulty = work_validate(data.hash, data.block.work)
        document.getElementById(rocketID).setAttribute("alt", work_difficulty.multiplier)
        let rocket_speed = speed
        if (SPEED_MULTIPLIER) rocket_speed *= parseInt(work_difficulty.multiplier)
        launchRocket(rocketID, rocket_speed)
    }

}


start_websockets(handle_new_block)