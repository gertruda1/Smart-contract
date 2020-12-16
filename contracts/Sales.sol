pragma solidity ^0.5.0;

contract Sales
{
    address[16] public buyers;
    
    //Buying a house
    
    function buy(uint houseId) public returns(uint)
    {
        require(houseId >= 0 && houseId <=15);
        
        buyers[houseId] = msg.sender;
        
        return houseId; //return houseId as a confirmation
    }
    
    //Retrieving the buyers
    
    function getBuyers() public view returns(address[16] memory)
    {
        return buyers;
    }
}