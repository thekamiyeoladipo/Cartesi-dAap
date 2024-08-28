const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2str(hex) {
  return ethers.toUtf8String(hex)
}

function str2hex(payload) {
  return ethers.hexlify(ethers.toUtf8Bytes(payload))
}

let proposals = {}
let votes = {}
let hasVoted = {}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
 
  const metadata = data["metadata"]
  const sender = metadata["msg_sender"]
  const payload = data["payload"]

  let action = JSON.parse(hex2str(payload))
  
  if (action.type === "create_proposal") {
    if (!action.name || !action.description) {
      await sendReport("Invalid proposal data");
      return "reject"
    }
    const proposalId = Object.keys(proposals).length;
    proposals[proposalId] = {
      name: action.name,
      description: action.description,
      creator: sender,
      yesVotes: 0,
      noVotes: 0
    }
    await sendNotice(`New proposal created: ${action.name}`);
  } else if (action.type === "vote") {
    if (!action.proposalId || !action.vote) {
      await sendReport("Invalid vote data");
      return "reject"
    }
    if (hasVoted[sender] && hasVoted[sender][action.proposalId]) {
      await sendReport("Already voted on this proposal");
      return "reject"
    }
    if (!proposals[action.proposalId]) {
      await sendReport("Proposal does not exist");
      return "reject"
    }
    if (action.vote === "yes") {
      proposals[action.proposalId].yesVotes++;
    } else if (action.vote === "no") {
      proposals[action.proposalId].noVotes++;
    } else {
      await sendReport("Invalid vote option");
      return "reject"
    }
    if (!hasVoted[sender]) hasVoted[sender] = {};
    hasVoted[sender][action.proposalId] = true;
    await sendNotice(`Vote recorded for proposal ${action.proposalId}`);
  } else {
    await sendReport("Invalid action type");
    return "reject"
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  
  const payload = data["payload"]
  const route = hex2str(payload)
  let responseObject

  if (route === "proposals") {
    responseObject = JSON.stringify(proposals)
  }
  else if (route.startsWith("proposal:")) {
    const proposalId = route.split(":")[1]
    responseObject = JSON.stringify(proposals[proposalId] || "Proposal not found")
  }
  else if (route.startsWith("voter:")) {
    const voter = route.split(":")[1]
    responseObject = JSON.stringify(hasVoted[voter] || "No votes recorded")
  }
  else {
    responseObject = "route not implemented"
  }

  await sendReport(responseObject);
  return "accept";
}

async function sendReport(message) {
  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(message) }),
  });
}

async function sendNotice(message) {
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: str2hex(message) }),
  });
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