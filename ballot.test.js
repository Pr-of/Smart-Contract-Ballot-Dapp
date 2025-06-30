const { expect } = require("chai");

describe("Ballot", function () {
    let Ballot, ballot, owner, addr1, addr2;

    beforeEach(async function () {
        Ballot = await ethers.getContractFactory("Ballot");
        [owner, addr1, addr2] = await ethers.getSigners();
        ballot = await Ballot.deploy([
            ethers.utils.formatBytes32String("Alice"),
            ethers.utils.formatBytes32String("Bob")
        ]);
        await ballot.deployed();
    });

    it("Should set the right chairperson", async function () {
        expect(await ballot.chairperson()).to.equal(owner.address);
    });

    it("Should give right to vote and allow voting", async function () {
        await ballot.giveRightToVote(addr1.address);
        await ballot.connect(addr1).vote(0);

        const proposal = await ballot.proposals(0);
        expect(proposal.voteCount).to.equal(1);
    });

    it("Should delegate votes", async function () {
        await ballot.giveRightToVote(addr1.address);
        await ballot.giveRightToVote(addr2.address);

        await ballot.connect(addr1).delegate(addr2.address);
        await ballot.connect(addr2).vote(1);

        const proposal = await ballot.proposals(1);
        expect(proposal.voteCount).to.equal(2);
    });

    it("Should return the correct winning proposal", async function () {
        await ballot.giveRightToVote(addr1.address);
        await ballot.giveRightToVote(addr2.address);

        await ballot.connect(addr1).vote(0);
        await ballot.connect(addr2).vote(1);

        const winningProposalIndex = await ballot.winningProposal();
        expect([0, 1]).to.include(winningProposalIndex);
    });
});