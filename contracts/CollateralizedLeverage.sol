// SPDX-License-Identifier: MIT
// Author: Saint Crypto

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenUSDT.sol";
import "hardhat/console.sol";

contract CollateralizedLeverage {

    address owner;

    uint public exchangeRate = 500; // per mille;
    uint public monthlyInterestRate = 50; // per mille;
    uint public loanId = 0;
    uint public month = 30 days;
    mapping(uint => Loan) public loan;

    TokenUSDT usdt;

    struct Loan {
        uint loanId;
        address payable lender;
        address payable borrower;
        uint usdt;
        uint eth;
        uint payback;
        uint duration;
        uint loanPosted;
        uint loanTaken;
        bool repaid;
        bool claimed;
    }

    constructor(address _usdt) {
        owner = msg.sender;
        usdt = TokenUSDT(_usdt);
    }

    function PostLoan(uint _amountUSDT, uint duration) external {
        //uint amountUSDT = _amountX * 1 ether;
        require(usdt.balanceOf(msg.sender) > _amountUSDT, "Not enough USDT");
        require(duration > 0, "Minimum 1 month");
        require(_amountUSDT > 0, "Too small loan");
        usdt.transferFrom(msg.sender, address(this), _amountUSDT);
        Loan memory l = Loan(loanId, payable(msg.sender), payable(address(0)), _amountUSDT, 0, 0, duration * month, block.timestamp, 0, false, false);
        loan[l.loanId] = l;
        loanId += 1; 
    }

    function TakeLoan(uint id) external payable {
        require(msg.sender != loan[id].lender, "Can't fill your own loan");
        uint amountETH = loan[id].usdt * 1000 / exchangeRate; // Twice amount to fill loan
        require(msg.value >= amountETH, "Insufficient balance");
        require(loan[id].loanTaken == 0, "Loan already taken");
        usdt.transfer(msg.sender, loan[id].usdt);
        loan[id].borrower = payable(msg.sender);
        loan[id].eth = amountETH;
        loan[id].loanTaken = block.timestamp;
    }

    function ClaimStable(uint id) public {
        require(msg.sender == loan[id].lender, "Not lender");
        require(block.timestamp > loan[id].loanTaken + loan[id].duration 
        || loan[id].repaid
        || PrincipalMoreThanCollateral(id), "Loan can't be active, has to be repaid or overdue");
        require(!loan[id].claimed, "Collateral already claimed");
        usdt.transfer(msg.sender, loan[id].payback);
        loan[id].claimed = true;
    }

    function GetAmountToPayBackIncremental(uint _loanID) public view returns (uint) {
        uint n = block.timestamp - loan[_loanID].loanTaken;
        return TotalToPay(loan[_loanID].usdt, n);
    }

    function TotalToPay(uint _base, uint _duration) internal view returns (uint) {
        uint a = _base * monthlyInterestRate / 1000;
        uint p = _duration / month;
        for (uint256 i = 0; i <= p; i++) {
            _base += a;
        }
        return _base;
    }

    function PayBack(uint _loanID) public {
        require(loan[_loanID].usdt > 0, "Nothing to payback");
        require(!loan[_loanID].repaid, "Loan repaid");
        require(loan[_loanID].borrower == msg.sender, "Kind gesture, but you can't pay back others loans");
        
        uint payback = GetAmountToPayBackIncremental(_loanID);
       
        bool success = usdt.transferFrom(msg.sender, address(this), payback);
        require(success);

        loan[_loanID].payback = payback;
        loan[_loanID].borrower.transfer(loan[_loanID].eth);
        loan[_loanID].repaid = true;
    }

    //Owner
    function UpgradeRate(uint _rate) public {
        require(_rate != 0, "Not zero rate");
        require(msg.sender == owner);
        exchangeRate = _rate;
    }

    /*
        BONUS: Can we add a check that allows the lender to take the collateral before the end of the lock period in case the previous situation applies?
    */
    function PrincipalMoreThanCollateral(uint _id) public view returns (bool) {
        return GetAmountToPayBackIncremental(_id) - loan[_id].usdt > loan[_id].usdt; 
    }

    /*
        BONUS: Assuming that the exchange rate between token A and token X will be the same. What is the maximum period it is advised to issue a loan? I.E. Is there a moment where collateral will be lower than principal+interest?
        ANSWER: 
    */

}       