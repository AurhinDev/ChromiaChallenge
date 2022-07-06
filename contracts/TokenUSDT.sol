//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenUSDT is ERC20, Ownable {

    // a mapping from an address to whether or not it can mint / burn
    mapping(address => bool) controllers;

    constructor() ERC20("TokenUSDT", "TokenUSDT") {
        _mint(msg.sender, 10 ether);
//        console.log("Hey from FRXST");
    }

    /**
     * mints $FRXST to a recipient
     * @param to the recipient of the $FRXST
   * @param amount the amount of $FRXST to mint
   */
    function mint(address to, uint256 amount) external {
        require(controllers[msg.sender], "Only controllers can mint");
        _mint(to, amount);
    }

    /**
     * burns $FRXST from a holder
     * @param from the holder of the $FRXST
   * @param amount the amount of $FRXST to burn
   */
    function burn(address from, uint256 amount) external {
        require(controllers[msg.sender], "Only controllers can burn");
        _burn(from, amount);
    }

    /**
     * enables an address to mint / burn
     * @param controller the address to enable
   */
    function addController(address controller) external onlyOwner {
        controllers[controller] = true;
    }

    /**
     * disables an address from minting / burning
     * @param controller the address to disable
   */
    function removeController(address controller) external onlyOwner {
        controllers[controller] = false;
    }
}