const { hexToString, stringToHex } = require("viem");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

let lotteryEntries = [];
let lotteryId = 0;

function selectWinner() {
  if (lotteryEntries.length === 0) return null;
  const winnerIndex = Math.floor(Math.random() * lotteryEntries.length);
  return lotteryEntries[winnerIndex];
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payloadString = hexToString(data.payload);
  console.log(`Converted payload: ${payloadString}`);

  try {
    const payload = JSON.parse(payloadString);
    let response;

    switch (payload.action) {
      case "buy_ticket":
        lotteryEntries.push(payload.address);
        response = `Ticket bought for address: ${payload.address}`;
        break;
      case "draw_winner":
        const winner = selectWinner();
        lotteryEntries = [];
        lotteryId++;
        response = winner ? `Winner of lottery #${lotteryId}: ${winner}` : "No participants in the lottery";
        break;
      default:
        response = "Invalid action";
    }

    const outputStr = stringToHex(response);
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: outputStr }),
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  
  const payload = data["payload"];
  const route = hex2str(payload);

  let responseObject;
  if (route === "entries") {
    responseObject = JSON.stringify(lotteryEntries);
  } else if (route === "lottery_id") {
    responseObject = JSON.stringify({ lotteryId });
  } else {
    responseObject = "route not implemented";
  }

  const report_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(responseObject) }),
  });

  return "accept";
}


var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();