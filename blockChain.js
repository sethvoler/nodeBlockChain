var  sha256 = require('crypto-js/sha256')

function Block(Data, PrevBlockHash) {
  //block headers,自成一个单独的数据结构
  this.headers = null;

  this.Timestamp = (new Date()).valueOf();//Number,当前的时间戳（即区块被创建的时间）
  this.PrevBlockHash = PrevBlockHash || [this.Timestamp];//arr,存储着前一个区块的哈希值, 创世块用当前时间戳代替

  //交易记录（Transactions，在这里就是Data）构成另外一个单独的数据结构。
  this.Data = Data;//arr,区块中实际包含的有用信息

  //简化处理，将两者混合到一个数据结构当中。
  this.DataStrctor = {
    Timestamp: this.Timestamp,
    PrevBlockHash: this.PrevBlockHash,
    _CurrentHash: this._CurrentHash,
    Data: this.Data
  }

  this.headers = this.DataStrctor.PrevBlockHash.concat(this.DataStrctor.Data);
  this.headers.push(this.DataStrctor.Timestamp);
  this.headers = this.headers.join('');
  //this._CurrentHash 当前区块的哈希值
  this._CurrentHash = sha256(this.headers).words;
  //this._CurrentHash = sha256(this.headers);
  this.DataStrctor._CurrentHash = this._CurrentHash,

  this.getHash = function() {
    return this.DataStrctor._CurrentHash;
  }
}

var createAndAddBlock = function (Data, PrevBlockHash) {
  var newBlcok = new Block(Data,PrevBlockHash);
  return newBlcok;
}

var currentHash = null;

function main(Data, currentHash) {
  var newBlock = createAndAddBlock(Data, currentHash);
  currentHash = newBlock.getHash();
  return {newBlock: newBlock, currentHash: currentHash};
}

main(1,currentHash);
currentHash = main(1,currentHash).currentHash;
console.log(currentHash);

main(2,currentHash);
currentHash = main(2,currentHash).currentHash;
console.log(currentHash);

