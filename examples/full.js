/* Usage: node read_all_sms.js /path/to/device */


var device   = process.argv[2];
var phoneNumber   = process.argv[3]; // e.g. 64869999

if(!device || !phoneNumber){
  return console.log('missing args', process.argv)
}

console.log([device, phoneNumber])

var modem = require('../index.js').Modem();

let strings = {
  test: "testing",
  shortEn: "kasjdl sdjablkdbaskj asdnlakdjakld",
  longEn: "kasjdl sdjablkdbaskj asdnlakdjakld longEn longEnajsdn dkaslkda dklasdn" + new Date(),
  chinese: "你好 kasjdl sdjablkdbaskj dbaskdj",
}

let sendSms = function(){
  let tstart = new Date().getTime()
  modem.sms({
    receiver:phoneNumber,
    text:strings.chinese,
    encoding:'16bit'
  }, function(err, sent_ids) {
    console.log(`done ${new Date().getTime() - tstart}`)

    if(err){
      console.log('send sms error', err, sent_ids);
      console.log('Error sending sms:', err);
    }
    else
      console.log('Message sent successfully, here are reference ids:', sent_ids.join(','));
  });

}

modem.open(device, function() {

  console.log('open')

  modem.getStatus(function(err, code) {
    if (code !== '0'){
      return console.log("not connected")
    }

    sendSms()

    modem.getMessages(function(rs) {
      console.log('got all messages')
      console.log(JSON.stringify(rs));
    })

    modem.on('memory full', function(sms) {
      console.log(sms);
    });

    modem.on('sms received', function(sms) {
      console.log(sms);
    });

    modem.on('delivery', function(rs) {
      console.log('delivery', rs);
    });

    modem.on('ring', function(sms) {
      console.log('got call', sms);
    });

  })

});