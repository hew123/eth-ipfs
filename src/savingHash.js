import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

class App extends Component{

  state = {
    ipfsHash:'',
    ethAddress:'',
    ethAccAddress:'',
    value:''
  };

  onChange = async(event) =>{
    this.setState({value: event.target.value});
  }

    getHash = async(event) =>{
      event.preventDefault();
      /*try{

        await web3.eth.getTransactionReceipt(this.state.transactionHash,
          (err,txReceipt) => {
            console.log(err,txReceipt);
            this.setState({txReceipt});
          });

        }//end of try {
        catch(error){
          console.log(error);
        }*/
        const ethAddress = await storehash.options.address;
        this.setState({ethAddress});

        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const ethAccAddress = accounts[0];
        //const ethAccAddress = await web3.eth.accounts[0];
        this.setState({ethAccAddress});

        //get hash from contract


        /*await storehash.methods.getHash().call((error,ipfsHash) =>
        {
          console.log(error, ipfsHash);
          this.setState({ipfsHash});
        });*/


      const ipfsHash = await storehash.methods.getHash().call();
      this.setState({ipfsHash});

      };//end of onClick

      onSubmit = async (event) =>{
        event.preventDefault();

        //user's metamask account
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const user = accounts[0];
        //const user = await web3.eth.accounts[0];
        //console.log('Sending from Metamask account: ' + accounts[0]);

        //const ethAddress = await storehash.options.address;
        //this.setState({ethAddress});

        //upload to ipfs
        /*await ipfs.add(this.state.buffer,(err,ipfsHash) => {
          console.log(err,ipfsHash);
          this.setState({ipfsHash:ipfsHash[0].hash});

          //call contract methods
          storehash.methods.saveHash(this.state.ipfsHash).send(
            {from:accounts[0]},(error,transactionHash) => {
              console.log(transactionHash);
              this.setState({transactionHash});
            });
          })*/
          storehash.methods.saveHash(this.state.value).send({from: user});
        };

    render(){
      console.log("wtffffff");
      return(
        <div className="App">
          <grid>
            <h3> Set new hash </h3>
            <form onSubmit={this.onSubmit}>
              <input type="text" value={this.state.value} onChange={this.onChange}/>
                <button bsStyle="primary" type="submit">
                    SetHash </button>
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
                    <td>{this.state.ethAddress}</td>
                  </tr>
                  <tr>
                    <td>From Account</td>
                    <td>{this.state.ethAccAddress}</td>
                  </tr>
                  <tr>
                    <td>value to place into new hash</td>
                    <td>{this.state.value}</td>
                  </tr>
                </tbody>
            </table>
        </grid>
     </div>
      );
    }
}

export default App;
