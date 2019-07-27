import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

class App extends Component{

  state = {
    ipfsHash:'',
    contractAddress:'',
    accAddress:'',
    buffer:'',
    returnHash:'',
    transactionHash:'',
    dataLink:''
  };

    //get contract's info
    getHash = async(event) =>{
      event.preventDefault();

      //get hash from contract
      const contractAddress = await storehash.options.address;
      this.setState({contractAddress});
      const ipfsHash = await storehash.methods.getHash().call();
      this.setState({ipfsHash});
      const dataLink = "https://ipfs.io/ipfs/"+ipfsHash;
      this.setState({dataLink});

        try{
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const accAddress = accounts[0];
          this.setState({accAddress});
        } catch(error){
          console.log(error);
        }

        console.log("contract's info retrieved");

      };//end of onClick

      //uploading file
      captureFile = (event) =>{
        event.stopPropagation();
        event.preventDefault();
        let self = this;
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async function(e) {
          var rawLog = reader.result;
          console.log(reader);
          const buffer = await Buffer.from(rawLog);
          self.setState({buffer});
          };
      };

      //upload to ipfs
      onSubmit = async (event) =>{
        event.preventDefault();

        //user's metamask account
        try{
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const user = accounts[0];
          console.log('Sending from Metamask account: ' + accounts[0]);


          //upload to ipfs
          await ipfs.add(this.state.buffer,(err,result) => {
            console.log(err,result);
            this.setState({returnHash:result[0].hash});

            //call contract methods
            storehash.methods.saveHash(this.state.returnHash).send(
              {from:accounts[0]},(error,transactionHash) => {
                console.log(transactionHash);
                this.setState({transactionHash});
              });
            })

          }catch(error){
            console.log(error);
          }

          /*const results = await ipfs.add(this.state.buffer);
          console.log("ipfs upload result: "+results);
          const hash = results[0].hash;
          console.log(hash);
          this.setState({returnHash:hash});*/
          //storehash.methods.saveHash(this.state.ipfsHash).send({from: user});
        };

    render(){
      return(
        <div className="App">
            <h3> Set new hash </h3>
            <form onSubmit={this.onSubmit}>
            <input type="file" onChange={this.captureFile}/>
                <button type="submit">
                    Upload to ipfs </button>
                    </form>
                    <hr/>


        <button onClick = {this.getHash}> Get Saved Hash </button>

          <table bordered responsive>
                <thead>
                  <tr>
                    <th>Tx Receipt Category</th>
                    <th>Values</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>IPFS Hash # stored on Eth Contract</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>
                  <tr>
                    <td>Ethereum Contract Address</td>
                    <td>{this.state.contractAddress}</td>
                  </tr>
                  <tr>
                    <td>From Account</td>
                    <td>{this.state.accAddress}</td>
                  </tr>
                  <tr>
                    <td> return hash </td>
                    <td>{this.state.returnHash}</td>
                  </tr>
                  <tr>
                    <td> data stored </td>
                    <td> <a href={this.state.dataLink}> link to data </a></td>
                  </tr>
                </tbody>
            </table>
     </div>
      );
    }
}

export default App;
