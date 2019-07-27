pragma solidity ^0.4.17;

contract Storage{

  string hash;

  function saveHash(string x) public {
    hash = x;
  }

  function getHash() public view returns (string) {
    return hash;
  }
}
