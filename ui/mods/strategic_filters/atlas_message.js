(function() {
  var message = function(mailbox, message, payload) {
    var boxName = 'mailbox:'+mailbox
    var mb = decode(localStorage.getItem(boxName)) || []
    mb.push({message: message, payload: payload})
    localStorage.setItem(boxName, encode(mb))
  }
  var check = function(mailbox) {
    var boxName = 'mailbox:'+mailbox
    var mb = decode(localStorage.getItem(boxName)) || []
    mb.forEach(function(item) {
      if (handlers[item.message]) {
        handlers[item.message](item.payload)
      }
    })
    localStorage.setItem(boxName, encode([]))
  }
  var poll = function(mailbox, timeout) {
    check(mailbox)
    setTimeout(poll, timeout, mailbox, timeout)
  }
  window.atlasMessage = {
    message: message,
    check: check,
    poll: poll,
  }
})()
