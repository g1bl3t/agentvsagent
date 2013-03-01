//
// Autogenerated by Thrift Compiler (0.9.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var Thrift = require('thrift').Thrift;

var ttypes = require('./hearts_types');
//HELPER FUNCTIONS AND STRUCTURES

Hearts_enter_arena_args = function(args) {
};
Hearts_enter_arena_args.prototype = {};
Hearts_enter_arena_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Hearts_enter_arena_args.prototype.write = function(output) {
  output.writeStructBegin('Hearts_enter_arena_args');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Hearts_enter_arena_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
Hearts_enter_arena_result.prototype = {};
Hearts_enter_arena_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.EntryResponse();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Hearts_enter_arena_result.prototype.write = function(output) {
  output.writeStructBegin('Hearts_enter_arena_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Hearts_get_hand_args = function(args) {
  this.ticket = null;
  if (args) {
    if (args.ticket !== undefined) {
      this.ticket = args.ticket;
    }
  }
};
Hearts_get_hand_args.prototype = {};
Hearts_get_hand_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.ticket = new ttypes.Ticket();
        this.ticket.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Hearts_get_hand_args.prototype.write = function(output) {
  output.writeStructBegin('Hearts_get_hand_args');
  if (this.ticket !== null && this.ticket !== undefined) {
    output.writeFieldBegin('ticket', Thrift.Type.STRUCT, 1);
    this.ticket.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Hearts_get_hand_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
Hearts_get_hand_result.prototype = {};
Hearts_get_hand_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.success = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = new ttypes.Card();
          elem6.read(input);
          this.success.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Hearts_get_hand_result.prototype.write = function(output) {
  output.writeStructBegin('Hearts_get_hand_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.LIST, 0);
    output.writeListBegin(Thrift.Type.STRUCT, this.success.length);
    for (var iter7 in this.success)
    {
      if (this.success.hasOwnProperty(iter7))
      {
        iter7 = this.success[iter7];
        iter7.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

HeartsClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this.seqid = 0;
    this._reqs = {};
};
HeartsClient.prototype = {};
HeartsClient.prototype.enter_arena = function(callback) {
  this.seqid += 1;
  this._reqs[this.seqid] = callback;
  this.send_enter_arena();
};

HeartsClient.prototype.send_enter_arena = function() {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('enter_arena', Thrift.MessageType.CALL, this.seqid);
  var args = new Hearts_enter_arena_args();
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

HeartsClient.prototype.recv_enter_arena = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new Hearts_enter_arena_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('enter_arena failed: unknown result');
};
HeartsClient.prototype.get_hand = function(ticket, callback) {
  this.seqid += 1;
  this._reqs[this.seqid] = callback;
  this.send_get_hand(ticket);
};

HeartsClient.prototype.send_get_hand = function(ticket) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('get_hand', Thrift.MessageType.CALL, this.seqid);
  var args = new Hearts_get_hand_args();
  args.ticket = ticket;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

HeartsClient.prototype.recv_get_hand = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new Hearts_get_hand_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('get_hand failed: unknown result');
};
HeartsProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
HeartsProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.Exception, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

HeartsProcessor.prototype.process_enter_arena = function(seqid, input, output) {
  var args = new Hearts_enter_arena_args();
  args.read(input);
  input.readMessageEnd();
  this._handler.enter_arena(function (err, result) {
    var result = new Hearts_enter_arena_result((err != null ? err : {success: result}));
    output.writeMessageBegin("enter_arena", Thrift.MessageType.REPLY, seqid);
    result.write(output);
    output.writeMessageEnd();
    output.flush();
  })
}

HeartsProcessor.prototype.process_get_hand = function(seqid, input, output) {
  var args = new Hearts_get_hand_args();
  args.read(input);
  input.readMessageEnd();
  this._handler.get_hand(args.ticket, function (err, result) {
    var result = new Hearts_get_hand_result((err != null ? err : {success: result}));
    output.writeMessageBegin("get_hand", Thrift.MessageType.REPLY, seqid);
    result.write(output);
    output.writeMessageEnd();
    output.flush();
  })
}

