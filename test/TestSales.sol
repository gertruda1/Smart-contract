pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Sales.sol";

contract TestSales
{
    // The address of the adoption contract to be tested
    Sales sales = Sales(DeployedAddresses.Sales());

    // The id of the house that will be used for testing
    uint expectedHouseId = 8;

    // The expected owner of bought house is this contract
    address expectedBuyer = address(this);


    //Testing the adopt() function
    function testUserCanBuyHouse() public
    {
        uint returnedId = sales.buy(expectedHouseId);

        Assert.equal(returnedId, expectedHouseId, "Sale of the expected house should match what is returned.");
    }

    // Testing retrieval of a single house's owner
    function testGetBuyerAddressByHouseId() public
    {
        address buyer = sales.buyers(expectedHouseId);

        Assert.equal(buyer, expectedBuyer, "Owner of the expected house should be this contract");

    }

    //Testing retrieval of all house owners
    function testGetBuyerAddressByHouseIdInArray() public
    {
        // Store buyers in memory rather than contract's storage
        address[16] memory buyers = sales.getBuyers();

        Assert.equal(buyers[expectedHouseId], expectedBuyer, "Owner of the expected pet should be this contract");
    }
}