import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import ipfs from './ipfs';
import storehash from './storehash';

class App extends Component{

  state = {
    ipfsHash:null,
    buffer:'',
    ethAddress:'',
    blockNumber:'',
    transanctionHash:'',
    gasUsed:'',
    txReceipt:''
  };

  captureFile = (event) =>{
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadrend = () => this.convertToBuffer(reader)
  };

    convertToBuffer = async(reader) => {
      const buffer = await Buffer.from(reader.result);
      this.setState({buffer});
    }

    onClick = async() =>{
      try{
        this.setState({blockNumber:"waiting.."});
        this.setState({gasUsed:"waiting.."});
        await web3.eth.getTransactionReceipt(this.state.transactionHash,
          (err,txReceipt) => {
            console.log(err,txReceipt);
            this.setState({txReceipt});
          });

          await this.setState({blockNumber:this.state.txReceipt.blockNumber});

          await this.setState({gasUsed:this.state.txReceipt.gasUsed});
        }//end of try {
        catch(error){
          console.log(error);
        }
      }//end of onClick

      onSubmit = async (event) =>{
        event.preventDefault();

        //user's metamask account
        const accounts = await web3.eth.getAccounts();
        console.log('Sending from Metamask account: ' + accounts[0]);

        const ethAddress = await storehash.options.address;
        this.setState({ethAddress});

        //upload to ipfs
        await ipfs.add(this.state.buffer,(err,ipfsHash) => {
          console.log(err,ipfsHash);
          this.setState({ipfsHash:ipfsHash[0].hash});

          //call contract methods
          storehash.methods.saveHash(this.state.ipfsHash).send(
            {from:accounts[0]},(error,transactionHash) => {
              console.log(transactionHash);
              this.setState({transactionHash});
            });
          })
        };

    render(){
      return(
        <div className="App">
          <header className="App-header">
            <h1> Ethereum and IPFS with Create React App</h1>
          </header>
          <hr/>
          <grid>
            <h3> Choose file to send to IPFS </h3>
            <form onSubmit={this.onSubmit}>
              <input type="file"
                onChange={this.captureFile}/>
                <button bsStyle="primary" type="submit">
                    Send it </button>
                    </form>
                    <hr/>
                    <button onClick> = {this.onClick}> Get Transaction Receipt </button>

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
                    <td>Tx Hash # </td>
                    <td>{this.state.transactionHash}</td>
                  </tr>
                  <tr>
                    <td>Block Number # </td>
                    <td>{this.state.blockNumber}</td>
                  </tr>
                  <tr>
                    <td>Gas Used</td>
                    <td>{this.state.gasUsed}</td>
                  </tr>
                </tbody>
            </table>
        </grid>
     </div>
      );
    }
}

export default App;
